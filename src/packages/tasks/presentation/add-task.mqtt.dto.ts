import { z } from 'nestjs-zod/z';
import { issuerContextTransportDtoSchema } from '../../../lib/command-bus/issuerContext';
import { createZodDto } from 'nestjs-zod';

const cronDtoSchemaCommon = z.object({
  id: z.string(),
  commandType: z.string(),
  command: z.record(z.unknown()),
});

const addTaskCommandDtoSchema = z.object({
  input: z.union([
    cronDtoSchemaCommon.merge(
      z.object({
        kind: z.literal('cron'),
        cron: z.string(),
      }),
    ),
    cronDtoSchemaCommon.merge(
      z.object({
        kind: z.literal('setup'),
      }),
    ),
  ]),
  context: issuerContextTransportDtoSchema,
});

export class AddTaskCommandDto extends createZodDto(addTaskCommandDtoSchema) {}
