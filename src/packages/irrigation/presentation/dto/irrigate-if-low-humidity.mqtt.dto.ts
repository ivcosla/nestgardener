import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';
import { readHumidityCommandSchema } from './read-humidity-command.mqtt.dto';
import { pumpWaterCommandSchema } from './pump-water-command.mqtt.dto';

export const irrigateIfLowHumidityCommandInputSchema = z.object({
  readHumidity: z.object(readHumidityCommandSchema.shape.input.shape),
  pumpWater: z.object(pumpWaterCommandSchema.shape.input.shape),
  whenHumidityUnder: z.number().int(),
});

export const irrigateIfLowHumidityCommandSchema = z.object({
  input: irrigateIfLowHumidityCommandInputSchema,
  context: issuerContextTransportDtoSchema,
});

export class IrrigateIfLowHumidityCommandDto extends createZodDto(
  irrigateIfLowHumidityCommandSchema,
) {}
