import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { ReadHumidityCommandDto } from './dto/read-humidity-command.mqtt.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ReadHumidityCommand } from '../app/commands/read-humidity.command';
import { ReadHumidityHandlerResult } from '../app/commands/read-humidity.command.handler';
import { GLOBAL_CONFIG } from '../../shared/config/global.config';
import { TogglePinCommand } from '../app/commands/toogle-pin.command';
import { TogglePinCommandDto } from './dto/toggle-pin-command.mqtt.dto';

const { THING_ID, ROOM_ID } = GLOBAL_CONFIG;

@Controller()
export class IrrigationController {
  private readonly logger = new Logger(IrrigationController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/read-humidity`)
  async readHumidity(
    @Payload() command: ReadHumidityCommandDto,
    @Ctx() context: MqttContext,
  ) {
    this.logger.log(`Received message from ${context.getTopic()}`);

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

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/toggle-pin`)
  async togglePin(
    @Payload() command: TogglePinCommandDto,
    @Ctx() context: MqttContext,
  ) {
    this.logger.log(`Received message from ${context.getTopic()}`);

    await this.commandBus.execute<TogglePinCommand, void>(
      new TogglePinCommand(
        command.input as TogglePinCommand['input'],
        command.context,
      ),
    );
  }
}
