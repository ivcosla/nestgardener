import { Result } from 'neverthrow';

export type CommandOutcome<TData, TEvent> = {
  data: TData;
  $events?: TEvent[];
};

export type CommandResult<
  TCommand extends CommandOutcome<unknown, unknown>,
  TErr = undefined,
> = Result<TCommand, TErr>;
