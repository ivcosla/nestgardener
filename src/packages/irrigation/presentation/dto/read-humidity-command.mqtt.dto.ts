import { z } from 'zod';

export const readHumidityCommandSchema = z.object({
  input: z.object({
    type: z.literal('ads1115'),
    pin: z.number().int().min(0).max(3),
  }),
  context: z.union([
    z.object({
      issuer: z.enum(['cron']),
      correlationId: z.string(),
      date: z.string(),
    }),
    z.object({
      issuer: z.literal('thing'),
      id: z.string(),
      correlationId: z.string(),
      date: z.string(),
    }),
  ]),
});

export type ReadHumidityCommandDto = z.infer<typeof readHumidityCommandSchema>;
