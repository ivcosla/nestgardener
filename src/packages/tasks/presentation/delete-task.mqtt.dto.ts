import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../lib/command-bus/issuer-context';
import { createZodDto } from 'nestjs-zod';

export const deleteTaskCommandDtoSchema = z.object({
  input: z.object({
    id: z.string(),
  }),
  context: issuerContextTransportDtoSchema,
});

export class DeleteTaskCommandDto extends createZodDto(
  deleteTaskCommandDtoSchema,
) {}
