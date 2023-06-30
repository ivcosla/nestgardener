import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CommandResult } from '../../../../lib/command-bus/command-result';
import { err, ok } from 'neverthrow';
import { CommandErroredEvent } from '../../../shared/generic-command-module/command-errored.domain.event';
import { PumpWaterCommand } from './pump-water.command';
import { WaterPumpedEvent } from '../../domain/events/water-pumped.event';
import { HumidityReadEvent } from '../../domain/events/humidity-read.event';
import { IrrigateIfLowHumidityCommand } from './irrigate-if-low-humidity.command';
import { ReadHumidityCommand } from './read-humidity.command';
import { ReadHumidityHandlerResult } from './read-humidity.command.handler';
import { PumpWaterCommandHandlerResult } from './pump-water.command.handler';

export type IrrigateIfLowHumidityHandlerResult = CommandResult<
  {
    data: {
      humidity: number;
    };
    $events: [HumidityReadEvent, WaterPumpedEvent?];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(IrrigateIfLowHumidityCommand)
export class IrrigateIfLowHumidityCommandHandler
  implements ICommandHandler<IrrigateIfLowHumidityCommand>
{
  private readonly logger = new Logger('IrrigateIfLowHumidityCommandHandler');

  constructor(private commandBus: CommandBus) {}

  async execute(
    command: IrrigateIfLowHumidityCommand,
  ): Promise<IrrigateIfLowHumidityHandlerResult> {
    const context = {
      ...command.context,
      command: 'irrigate-if-low-humidity',
    };

    const humidityReadResult = await this.commandBus.execute<
      ReadHumidityCommand,
      ReadHumidityHandlerResult
    >(new ReadHumidityCommand(command.input.readHumidity, context));

    if (humidityReadResult.isErr()) {
      return err({
        $events: [humidityReadResult.error.$events[0]],
      });
    }

    if (
      humidityReadResult.value.data.humidity > command.input.whenHumidityUnder
    ) {
      this.logger.log('humidity is high, not irrigating');
      return ok({
        data: {
          humidity: humidityReadResult.value.data.humidity,
        },
        $events: [humidityReadResult.value.$events[0]],
      });
    }
    this.logger.log('humidity is low, irrigating...');

    const pumpWaterResult = await this.commandBus.execute<
      PumpWaterCommand,
      PumpWaterCommandHandlerResult
    >(new PumpWaterCommand(command.input.pumpWater, context));

    if (pumpWaterResult.isErr()) {
      return err({
        $events: [pumpWaterResult.error.$events[0]],
      });
    }

    this.logger.log('irrigated');
    return ok({
      data: {
        humidity: humidityReadResult.value.data.humidity,
      },
      $events: [
        humidityReadResult.value.$events[0],
        pumpWaterResult.value.$events[0],
      ],
    });
  }
}
