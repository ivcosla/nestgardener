import { v1 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ReadHumidityCommand } from '../../domain/commands/read-humidity.command';
import { ReadHumidityHandlerResult } from '../../domain/commands/read-humidity.handler';

type IIrrigationService = {
  readHumidity: (gpio: number) => Promise<number>;
};

@Injectable()
export class IrrigationService implements IIrrigationService {
  constructor(private commandBus: CommandBus) {}

  async readHumidity(gpio: number): Promise<number> {
    const result = await this.commandBus.execute<
      ReadHumidityCommand,
      ReadHumidityHandlerResult
    >(
      new ReadHumidityCommand(
        {
          type: 'ads1115',
          pin: gpio as 0 | 1 | 2 | 3,
        },
        {
          // TODO: change when needed, no use now
          issuer: 'cron',
          correlationId: v1(),
          date: new Date().toISOString(),
        },
      ),
    );
    if (result.isErr()) {
      throw result.error;
    }

    return result.value.data.humidity;
  }
}
