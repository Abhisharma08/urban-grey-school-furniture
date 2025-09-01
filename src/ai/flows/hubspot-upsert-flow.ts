
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

const HubspotUpsertInputSchema = z.object({
  email: z.string().email().describe("The contact's email address."),
  fullName: z.string().optional().describe("The contact's full name."),
  phoneNumber: z.string().optional().describe("The contact's phone number."),
  city: z.string().optional().describe("The contact's city."),
  requirement: z.enum([
    "Dining Tables & Chairs", 
    "Booth & Sofa Seating", 
    "Outdoor & Patio Furniture", 
 
    ]).optional().describe('The contact\'s furniture requirement.'),
  quantity: z.enum(["3+", "6+", "8+", "12+", "15+", "20+"]).optional().describe('The required quantity.'),
});
export type HubspotUpsertInput = z.infer<typeof HubspotUpsertInputSchema>;

const HubspotUpsertOutputSchema = z.object({
  id: z.string().describe('The HubSpot contact ID.'),
  isNew: z.boolean().describe('Whether a new contact was created.'),
});
export type HubspotUpsertOutput = z.infer<typeof HubspotUpsertOutputSchema>;

async function callHubspotAPI(url: string, method: 'POST' | 'PATCH' | 'GET', body?: any) {
    const apiKey = process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
        console.error('HubSpot API key is not configured.');
        throw new Error('HubSpot API key is not configured. Please set HUBSPOT_API_KEY in your environment variables.');
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('HubSpot API Error:', `Status: ${response.status}`, `Body: ${errorBody}`);
        throw new Error(`HubSpot API request failed with status ${response.status}`);
    }

    return response.json();
}

export const hubspotUpsert = ai.defineFlow(
  {
    name: 'hubspotUpsert',
    inputSchema: HubspotUpsertInputSchema,
    outputSchema: HubspotUpsertOutputSchema,
  },
  async (input) => {
    // 1. Search for an existing contact by email
    const searchUrl = `${HUBSPOT_API_BASE_URL}/search`;
    let existingContactId: string | null = null;
    try {
        const searchResponse = await callHubspotAPI(searchUrl, 'POST', {
            filterGroups: [{
                filters: [{
                    propertyName: 'email',
                    operator: 'EQ',
                    value: input.email
                }]
            }],
            properties: ["email"],
            limit: 1
        });
        if (searchResponse.total > 0) {
            existingContactId = searchResponse.results[0].id;
        }
    } catch (error) {
        // Don't fail the flow if search fails for some reason, we can proceed to create
        console.warn("HubSpot contact search failed, proceeding to create.", error);
    }
    
    // 2. Prepare contact properties
    const properties: Record<string, any> = {
        email: input.email,
    };
    if (input.fullName) {
        const [firstname, ...lastname] = input.fullName.split(' ');
        properties.firstname = firstname;
        properties.lastname = lastname.join(' ');
    }
    if (input.phoneNumber) properties.phone = input.phoneNumber;
    if (input.city) properties.city = input.city;
    if (input.requirement) {
        properties.lifecyclestage = "lead";
        properties.what_is_your_requirement_ = input.requirement; 
    }
    if (input.quantity) properties.quantity_required = input.quantity;

    // 3. Update or Create contact
    let hubspotResponse;
    let isNew = false;

    if (existingContactId) {
      // Update existing contact
      const url = `${HUBSPOT_API_BASE_URL}/${existingContactId}`;
      hubspotResponse = await callHubspotAPI(url, 'PATCH', { properties });
    } else {
      // Create new contact
      hubspotResponse = await callHubspotAPI(HUBSPOT_API_BASE_URL, 'POST', { properties });
      isNew = true;
    }
    
    return { id: hubspotResponse.id, isNew };
  }
);
