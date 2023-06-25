import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommandResult } from '../../../../lib/command-bus/commandResult';
import { err, ok } from 'neverthrow';
import { CommandErroredEvent } from '../../../shared/command-errored/command-errored.domain.event';
import { PumpWaterCommand } from './pump-water.command';
import { WaterPumpService } from '../../infrastructure/water-pump.actuator.service';
import { WaterPumpedEvent } from '../../domain/events/water-pumped.event';

export type PumpWaterCommandHandlerResult = CommandResult<
  {
    data: 'pumped';
    $events: [WaterPumpedEvent];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(PumpWaterCommand)
export class PumpWaterCommandHandler
  implements ICommandHandler<PumpWaterCommand>
{
  private readonly logger = new Logger('PumpWaterCommandHandler');

  constructor(
    private eventBus: EventBus,
    private waterPumpService: WaterPumpService,
  ) {}

  async execute(
    command: PumpWaterCommand,
  ): Promise<PumpWaterCommandHandlerResult> {
    this.logger.log('pumping water...');

    const context = {
      ...command.context,
      command: 'read-humidity',
    };

    const pumpResult = await this.waterPumpService.pumpFor(
      command.input.pin,
      command.input.durationInMilliseconds,
    );

    if (pumpResult.isErr()) {
      const errorEvent = new CommandErroredEvent(context, pumpResult.error);

      this.eventBus.publish(errorEvent);

      return err({
        issuer: command.context.issuer,
        $events: [errorEvent],
      });
    }

    const event = new WaterPumpedEvent(
      {
        pin: command.input.pin,
        pumpDuration: command.input.durationInMilliseconds,
        observedAt: new Date(),
      },
      context,
    );

    this.eventBus.publish(event);

    this.logger.log('water pumped');
    return ok({
      data: 'pumped',
      $events: [event],
    });
  }
}
