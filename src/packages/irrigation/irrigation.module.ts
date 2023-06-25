import { CqrsModule } from '@nestjs/cqrs';
import { IrrigationService } from './app/services/irrigation.app.service';
import { Module } from '@nestjs/common';
import { ReadHumidityHandler } from './app/commands/read-humidity.command.handler';
import { BoardModule } from '../shared/board/board.module';
import { HumidityReadEventHandler } from './app/event-handlers/humidity-read.event.handler';
import { HumidityServiceFactory } from './infrastructure/soil-humidity.factory';
import { PinToggledEventHandler } from './app/event-handlers/pin-toggled.event.handler';
import { TogglePinHandler } from './app/commands/toogle-pin.command.handler';
import { IrrigationCronSaga } from './app/event-handlers/cron-ticked.event.handler';
import { OutboxModule } from '../shared/outbox/outbox.module';
import { WaterPumpService } from './infrastructure/water-pump.actuator.service';

const services = [IrrigationService, HumidityServiceFactory, WaterPumpService];
const commandHandlers = [ReadHumidityHandler, TogglePinHandler];
const eventHandlers = [HumidityReadEventHandler, PinToggledEventHandler];
const sagas = [IrrigationCronSaga];
@Module({
  imports: [CqrsModule, OutboxModule, BoardModule],
  providers: [...services, ...commandHandlers, ...eventHandlers, ...sagas],
  exports: [CqrsModule, OutboxModule, BoardModule],
})
export class IrrigationModule {}
