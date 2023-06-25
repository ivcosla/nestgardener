import { z } from 'zod';
import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export const pinToggledDomainInputSchema = z.object({
  pin: z.number(),
  value: z
    .number()
    .int()
    .min(0)
    .max(1)
    .refine((v) => v as 0 | 1),
});

type ITogglePinCommand = {
  input: {
    pin: number;
    value: 0 | 1;
  };
  context: IssuerContext;
};

export class TogglePinCommand {
  constructor(
    readonly input: ITogglePinCommand['input'],
    readonly context: ITogglePinCommand['context'],
  ) {}
}
