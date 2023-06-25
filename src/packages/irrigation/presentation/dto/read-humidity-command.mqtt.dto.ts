import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuerContext';
import { createZodDto } from 'nestjs-zod';

const readHumidityCommandSchema = z.object({
  input: z.object({
    type: z.literal('ads1115'),
    pin: z.number().int().min(0).max(3),
  }),
  context: issuerContextTransportDtoSchema,
});

export class ReadHumidityCommandDto extends createZodDto(
  readHumidityCommandSchema,
) {}
