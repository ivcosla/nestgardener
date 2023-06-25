import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../../lib/command-bus/issuerContext';
import { createZodDto } from 'nestjs-zod';

const togglePinDtoSchema = z.object({
  input: z.object({
    pin: z.number().int(),
    value: z.number().int().min(0).max(1),
  }),
  context: issuerContextTransportDtoSchema,
});

export class TogglePinCommandDto extends createZodDto(togglePinDtoSchema) {}
