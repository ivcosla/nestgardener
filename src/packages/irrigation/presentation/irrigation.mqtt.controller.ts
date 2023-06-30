import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReadHumidityCommandDto } from './dto/read-humidity-command.mqtt.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ReadHumidityCommand } from '../app/commands/read-humidity.command';
import { GLOBAL_CONFIG } from '../../shared/config/global.config';
import { TogglePinCommand } from '../app/commands/toggle-pin.command';
import { TogglePinCommandDto } from './dto/toggle-pin-command.mqtt.dto';
import { MqttLoggingInterceptor } from '../../../interceptors/mqtt-logging.interceptor';
import { PumpWaterCommandDto } from './dto/pump-water-command.mqtt.dto';
import { PumpWaterCommand } from '../app/commands/pump-water.command';
import { IrrigateIfLowHumidityCommandDto } from './dto/irrigate-if-low-humidity.mqtt.dto';
import { IrrigateIfLowHumidityCommand } from '../app/commands/irrigate-if-low-humidity.command';

const { THING_ID, ROOM_ID } = GLOBAL_CONFIG;

@UseInterceptors(new MqttLoggingInterceptor())
@Controller()
export class IrrigationController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(
    `/gardener/${ROOM_ID}/${THING_ID}/command/irrigate-if-low-humidity`,
  )
  irrigateIfLowHumidity(@Payload() command: IrrigateIfLowHumidityCommandDto) {
    this.commandBus.execute(
      new IrrigateIfLowHumidityCommand(
        command.input as IrrigateIfLowHumidityCommand['input'],
        command.context,
      ),
    );
  }

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/read-humidity`)
  readHumidity(@Payload() command: ReadHumidityCommandDto) {
    this.commandBus.execute(
      new ReadHumidityCommand(
        command.input as ReadHumidityCommand['input'],
        command.context,
      ),
    );
  }

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/toggle-pin`)
  togglePin(@Payload() command: TogglePinCommandDto) {
    this.commandBus.execute(
      new TogglePinCommand(
        command.input as TogglePinCommand['input'],
        command.context,
      ),
    );
  }

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/pump-water`)
  pumpWater(@Payload() command: PumpWaterCommandDto) {
    this.commandBus.execute(
      new PumpWaterCommand(command.input, command.context),
    );
  }
}
