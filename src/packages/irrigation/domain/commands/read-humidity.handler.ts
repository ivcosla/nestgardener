import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReadHumidityCommand } from './read-humidity.command';
import { Logger } from '@nestjs/common';
import { HumidityReadEvent } from '../events/humidity-read.domain.event';
import { CommandResult } from '../../../../lib/commandBus/commandResult';
import { err, ok } from 'neverthrow';
import { CommandErroredEvent } from '../../../shared/command-errored/command-errored.domain.event';
import { HumidityServiceFactory } from '../../infrastructure/sensors/soil-humidity/soil-humidity.factory';

export type ReadHumidityHandlerResult = CommandResult<
  {
    data: {
      humidity: number;
    };
    $events: [HumidityReadEvent];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(ReadHumidityCommand)
export class ReadHumidityHandler
  implements ICommandHandler<ReadHumidityCommand>
{
  private readonly logger = new Logger('ReadHumidityHandler');

  constructor(
    private eventBus: EventBus,
    private humidityServiceFactory: HumidityServiceFactory,
  ) {}

  async execute(
    command: ReadHumidityCommand,
  ): Promise<ReadHumidityHandlerResult> {
    this.logger.log('executed:', JSON.stringify(command));

    const {
      input: { type, ...params },
    } = command;

    const context = {
      ...command.context,
      command: 'read-humidity',
    };

    const readResult = await this.humidityServiceFactory
      .create(type)
      .read(params.pin);
    if (readResult.isErr()) {
      const errorEvent = new CommandErroredEvent(context, readResult.error);

      console.error('Im the command handler emitting the event!');

      this.eventBus.publish(errorEvent);

      return err({
        issuer: command.context.issuer,
        $events: [errorEvent],
      });
    }

    const event = new HumidityReadEvent(
      {
        ...command.context,
        command: 'read-humidity',
      },
      {
        humidity: readResult.value,
        timestamp: new Date(),
      },
    );

    this.logger.debug('readGpio result:', readResult.value);

    this.eventBus.publish(event);

    return ok({
      data: {
        humidity: event.data.humidity,
      },
      $events: [event],
    });
  }
}
