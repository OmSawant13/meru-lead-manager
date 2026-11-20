import { z } from 'zod';

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Outreach',
  'LinkedIn',
  'Advertisement',
  'Event',
  'Other',
] as const;

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Lead name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(150, 'Email cannot exceed 150 characters'),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s\-().]{7,25}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
    .nullable(),
  company: z
    .string()
    .trim()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional()
    .or(z.literal(''))
    .nullable(),
  source: z.enum(LEAD_SOURCES, {
    errorMap: () => ({ message: `Source must be one of: ${LEAD_SOURCES.join(', ')}` }),
  }).default('Website'),
  status: z.enum(LEAD_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
  }).default('New'),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional()
    .or(z.literal(''))
    .nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const queryLeadsSchema = z.object({
  search: z.string().optional(),
  status: z.enum([...LEAD_STATUSES, 'All']).optional(),
  source: z.enum([...LEAD_SOURCES, 'All']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['name', 'email', 'company', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>;
