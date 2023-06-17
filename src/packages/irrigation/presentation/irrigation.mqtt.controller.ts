import { Controller, Inject, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { readHumidityCommandSchema } from './dto/read-humidity-command.mqtt.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ReadHumidityCommand } from '../domain/commands/read-humidity.command';
import { ReadHumidityHandlerResult } from '../domain/commands/read-humidity.handler';
import { GLOBAL_CONFIG } from '../../shared/config/global.config';

const { THING_ID } = GLOBAL_CONFIG;

@Controller()
export class IrrigationController {
  private readonly logger = new Logger(IrrigationController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(`/gardener/${THING_ID}/command/read-humidity`)
  async readHumidity(@Payload() data: unknown, @Ctx() context: MqttContext) {
    this.logger.log(`Received message from ${context.getTopic()}`);

    const command = readHumidityCommandSchema.parse(data);

    await this.commandBus.execute<
      ReadHumidityCommand,
      ReadHumidityHandlerResult
    >(
      new ReadHumidityCommand(
        command.input as ReadHumidityCommand['input'],
        command.context,
      ),
    );
  }
}
