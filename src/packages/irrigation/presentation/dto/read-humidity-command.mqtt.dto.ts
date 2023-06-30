import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';

export const readHumidityCommandInputSchema = z.object({
  type: z.literal('ads1115'),
  pin: z.number().int().min(0).max(3),
});

export const readHumidityCommandSchema = z.object({
  input: readHumidityCommandInputSchema,
  context: issuerContextTransportDtoSchema,
});

export class ReadHumidityCommandDto extends createZodDto(
  readHumidityCommandSchema,
) {}
