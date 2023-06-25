import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TogglePinCommand } from './toogle-pin.command';
import { CommandResult } from '../../../../lib/command-bus/commandResult';
import { IBoardService } from '../../../shared/board/board.service';
import { PinToggledEvent } from '../../domain/events/pin-toggled.event';
import { CommandErroredEvent } from '../../../shared/command-errored/command-errored.domain.event';
import { err, ok } from 'neverthrow';
import { Inject } from '@nestjs/common';

export type TogglePinHandlerResult = CommandResult<
  {
    data: 'ok';
    $events: [PinToggledEvent];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(TogglePinCommand)
export class TogglePinHandler implements ICommandHandler<TogglePinCommand> {
  constructor(
    private eventBus: EventBus,
    @Inject('BoardService') private board: IBoardService,
  ) {}

  async execute(command: TogglePinCommand): Promise<TogglePinHandlerResult> {
    const { input } = command;

    const writeResult = await this.board.writeGpio(input.pin, input.value);
    if (writeResult.isErr()) {
      const errorEvent = new CommandErroredEvent(
        command.context,
        writeResult.error,
      );

      this.eventBus.publish(errorEvent);

      return err({
        issuer: command.context.issuer,
        $events: [errorEvent],
      });
    }

    const event = new PinToggledEvent(
      {
        pin: input.pin,
        setValue: input.value,
      },
      command.context,
    );

    this.eventBus.publish(event);

    return ok({
      data: 'ok',
      $events: [event],
    });
  }
}
