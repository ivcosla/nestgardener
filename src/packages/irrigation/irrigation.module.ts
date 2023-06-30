import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { BoardModule } from '../shared/board/board.module';
import { OutboxModule } from '../shared/outbox/outbox.module';

import { HumidityServiceFactory, WaterPumpService } from './domain';

import {
  HumidityReadEventHandler,
  IrrigateIfLowHumidityCommandHandler,
  IrrigationCronSaga,
  PinToggledEventHandler,
  PumpWaterCommandHandler,
  ReadHumidityCommandHandler,
  TogglePinCommandHandler,
  WaterPumpedEventHandler,
} from './app';

const services = [HumidityServiceFactory, WaterPumpService];

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
