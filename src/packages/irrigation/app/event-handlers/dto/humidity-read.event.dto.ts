import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';

const humidityReadEventSchema = z.object({
  context: issuerContextTransportDtoSchema,
  data: z.object({
    humidity: z.number().int(),
    timestamp: z.string().describe('ISO 8601 date string'),
  }),
});

export class HumidityReadEventDto extends createZodDto(
  humidityReadEventSchema,
) {}
