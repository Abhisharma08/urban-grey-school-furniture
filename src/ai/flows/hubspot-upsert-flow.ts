'use server';
/**
 * @fileOverview A flow for creating or updating a HubSpot contact.
 *
 * - hubspotUpsert - Creates or updates a contact in HubSpot based on email address.
 * - HubspotUpsertInput - The input type for the hubspotUpsert function.
 * - HubspotUpsertOutput - The return type for the hubspotUpsert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HUBSPOT_SEARCH_URL = `${HUBSPOT_API_BASE_URL}/search`;

const HubspotUpsertInputSchema = z.object({
  email: z.string().email().describe("The contact's email address."),
  fullName: z.string().optional().describe("The contact's full name."),
  phoneNumber: z.string().optional().describe("The contact's phone number."),
  city: z.string().optional().describe("The contact's city."),
  requirement: z
    .enum([
    "Classroom Desks & Benches",
    "Library & Collaborative Seating",
    "Kindergarten Desks & Benches",
    ])
    .optional()
    .describe("The contact's furniture requirement."),
  quantity: z.enum(['3+', '6+', '8+', '12+', '15+', '20+']).optional().describe('The required quantity.'),
});
export type HubspotUpsertInput = z.infer<typeof HubspotUpsertInputSchema>;

const HubspotUpsertOutputSchema = z.object({
  id: z.string().describe('The HubSpot contact ID.'),
  isNew: z.boolean().describe('Whether a new contact was created.'),
});
export type HubspotUpsertOutput = z.infer<typeof HubspotUpsertOutputSchema>;

// ---- Internal helpers ----

type HttpMethod = 'POST' | 'PATCH';

async function callHubspotAPI<T>(url: string, method: HttpMethod, body?: unknown): Promise<T> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    throw new Error('HubSpot API key is not configured. Please set HUBSPOT_API_KEY in your environment variables.');
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HubSpot API request failed (${res.status}): ${text}`);
  }

  return (text ? JSON.parse(text) : {}) as T;
}

async function searchContactIdByEmail(email: string): Promise<string | null> {
  type SearchResp = {
    total?: number;
    results?: Array<{ id: string }>;
  };

  const payload = {
    filterGroups: [
      {
        filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
      },
    ],
    properties: ['email', 'lead_source'], // include lead_source in first step
    limit: 1,
  };

  try {
    const resp = await callHubspotAPI<SearchResp>(HUBSPOT_SEARCH_URL, 'POST', payload);
    return resp?.results?.[0]?.id ?? null;
  } catch (err) {
    console.warn('HubSpot contact search failed, proceeding to create.', err);
    return null;
  }
}

function buildProperties(input: HubspotUpsertInput) {
  const properties: Record<string, string> = {
    email: input.email,
    lead_source: 'school-furniture', // custom property always added at the start
  };

  if (input.fullName) {
    const [firstname, ...lastname] = input.fullName.trim().split(/\s+/);
    properties.firstname = firstname || '';
    if (lastname.length > 0) properties.lastname = lastname.join(' ');
  }

  if (input.phoneNumber) properties.phone = input.phoneNumber;
  if (input.city) properties.city = input.city;

  if (input.requirement) {
    properties.lifecyclestage = 'lead';
    properties['what_is_your_requirement_'] = input.requirement;
  }

  if (input.quantity) properties['quantity_required'] = input.quantity;

  return properties;
}

// ---- Public flow ----

export const hubspotUpsert = ai.defineFlow(
  {
    name: 'hubspotUpsert',
    inputSchema: HubspotUpsertInputSchema,
    outputSchema: HubspotUpsertOutputSchema,
  },
  async (input): Promise<HubspotUpsertOutput> => {
    const properties = buildProperties(input);

    // 1) Try to find an existing contact by email
    let existingContactId = await searchContactIdByEmail(input.email);

    // 2) Update or create
    if (existingContactId) {
      const url = `${HUBSPOT_API_BASE_URL}/${existingContactId}`;
      const resp = await callHubspotAPI<{ id: string }>(url, 'PATCH', { properties });
      return { id: resp.id, isNew: false };
    } else {
      const resp = await callHubspotAPI<{ id: string }>(HUBSPOT_API_BASE_URL, 'POST', { properties });
      return { id: resp.id, isNew: true };
    }
  }
);