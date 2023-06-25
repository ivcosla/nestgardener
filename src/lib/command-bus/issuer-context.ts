import { z } from 'zod';

export type CronOrServiceIssuerContext = {
  issuer: 'cron' | 'service';
  who?: string;
  correlationId: string;
  date: string;
};

export type SetupIssuerContext = {
  issuer: 'thing';
  id: string;
  correlationId: string;
  date: string;
};

export type IssuerContext = CronOrServiceIssuerContext | SetupIssuerContext;

export const issuerContextTransportDtoSchema = z.union([
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
]);

export type IssuerContextTransportDto = z.infer<
  typeof issuerContextTransportDtoSchema
>;
