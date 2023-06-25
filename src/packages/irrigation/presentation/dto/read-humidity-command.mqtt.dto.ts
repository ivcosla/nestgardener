import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';

export const readHumidityCommandSchema = z.object({
  input: z.object({
    type: z.literal('ads1115'),
    pin: z.number().int().min(0).max(3),
  }),
  context: issuerContextTransportDtoSchema,
});

export class ReadHumidityCommandDto extends createZodDto(
  readHumidityCommandSchema,
) {}
