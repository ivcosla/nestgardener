import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';

export const pumpWaterCommandInputSchema = z.object({
  pin: z.number().int(),
  durationInMilliseconds: z.number().int(),
});

export const pumpWaterCommandSchema = z.object({
  input: pumpWaterCommandInputSchema,
  context: issuerContextTransportDtoSchema,
});

export class PumpWaterCommandDto extends createZodDto(pumpWaterCommandSchema) {}
