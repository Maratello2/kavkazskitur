import { z } from 'zod';

export const bookingSchema = z.object({
  tourSlug: z.string().min(1, 'Tour slug required'),
  tourTitle: z.string().min(1, 'Tour title required'),
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().min(6, 'Phone number required'),
  participants: z.coerce.number().int().min(1).max(20).default(1),
  preferredDate: z.string().optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  consent152: z.literal(true, { message: 'Consent is required' }),
  website_hp: z.string().optional(), // Honeypot: silently ignored if filled
});

export type BookingInput = z.infer<typeof bookingSchema>;
