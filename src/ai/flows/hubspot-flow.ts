
'use server';
/**
 * @fileOverview A flow for interacting with the HubSpot API.
 *
 * - saveToHubspot - A function that creates or updates a HubSpot contact.
 * - HubspotContactInput - The input type for the saveToHubspot function.
 * - HubspotContactOutput - The return type for the saveToHubspot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';

const HubspotContactInputSchema = z.object({
  hubspotId: z.string().optional().describe('The HubSpot contact ID to update. If not provided, a new contact will be created.'),
  email: z.string().email().describe('The contact\'s email address.'),
  fullName: z.string().optional().describe('The contact\'s full name.'),
  phoneNumber: z.string().optional().describe('The contact\'s phone number.'),
  city: z.string().optional().describe("The contact's city."),
  requirement: z.enum([
    "Dining Tables & Chairs", 
    "Booth & Sofa Seating", 
    "Outdoor & Patio Furniture", 
  
    ]).optional().describe('The contact\'s furniture requirement.'),
  quantity: z.enum(["3+", "5-10+", "11-15+"]).optional().describe('The required quantity.'),
});
export type HubspotContactInput = z.infer<typeof HubspotContactInputSchema>;

const HubspotContactOutputSchema = z.object({
  id: z.string().describe('The HubSpot contact ID.'),
});
export type HubspotContactOutput = z.infer<typeof HubspotContactOutputSchema>;

async function callHubspotAPI(url: string, method: 'POST' | 'PATCH', body: any) {
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
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('HubSpot API Error:', `Status: ${response.status}`, `Body: ${errorBody}`);
        throw new Error(`HubSpot API request failed with status ${response.status}`);
    }

    return response.json();
}


export const saveToHubspot = ai.defineFlow(
  {
    name: 'saveToHubspot',
    inputSchema: HubspotContactInputSchema,
    outputSchema: HubspotContactOutputSchema,
  },
  async (input) => {
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
    if (input.requirement) properties.lifecyclestage = "lead"; // Standard HubSpot property
    if (input.requirement) properties.what_is_your_requirement_ = input.requirement; // Use a custom property for this
    if (input.quantity) properties.quantity_required = input.quantity; // Use a custom property for this

    let hubspotResponse;

    if (input.hubspotId) {
      // Update existing contact
      const url = `${HUBSPOT_API_URL}/${input.hubspotId}`;
      hubspotResponse = await callHubspotAPI(url, 'PATCH', { properties });
    } else {
      // Create new contact
      hubspotResponse = await callHubspotAPI(HUBSPOT_API_URL, 'POST', { properties });
    }
    
    return { id: hubspotResponse.id };
  }
);
