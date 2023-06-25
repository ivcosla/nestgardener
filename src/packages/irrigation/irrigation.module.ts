import { CqrsModule } from '@nestjs/cqrs';
import { IrrigationService } from './app/services/irrigation.app.service';
import { Module } from '@nestjs/common';
import { ReadHumidityCommandHandler } from './app/commands/read-humidity.command.handler';
import { BoardModule } from '../shared/board/board.module';
import { HumidityReadEventHandler } from './app/event-handlers/humidity-read.event.handler';
import { HumidityServiceFactory } from './infrastructure/soil-humidity.factory';
import { PinToggledEventHandler } from './app/event-handlers/pin-toggled.event.handler';
import { TogglePinCommandHandler } from './app/commands/toogle-pin.command.handler';
import { IrrigationCronSaga } from './app/event-handlers/cron-ticked.event.handler';
import { OutboxModule } from '../shared/outbox/outbox.module';
import { WaterPumpService } from './infrastructure/water-pump.actuator.service';
import { PumpWaterCommandHandler } from './app/commands/pump-water.command.handler';
import { WaterPumpedEventHandler } from './app/event-handlers/water-pumped.event.handler';
import { IrrigateIfLowHumidityCommandHandler } from './app/commands/irrigate-if-low-humidity.command.handler';

const services = [IrrigationService, HumidityServiceFactory, WaterPumpService];
const commandHandlers = [
  IrrigateIfLowHumidityCommandHandler,
  ReadHumidityCommandHandler,
  TogglePinCommandHandler,
  PumpWaterCommandHandler,
];
const eventHandlers = [
  HumidityReadEventHandler,
  PinToggledEventHandler,
  WaterPumpedEventHandler,
];
const sagas = [IrrigationCronSaga];
@Module({
  imports: [CqrsModule, OutboxModule, BoardModule],
  providers: [...services, ...commandHandlers, ...eventHandlers, ...sagas],
  exports: [CqrsModule, OutboxModule, BoardModule],
})
export class IrrigationModule {}
