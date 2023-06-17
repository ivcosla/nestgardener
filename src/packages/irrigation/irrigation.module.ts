import { CqrsModule } from '@nestjs/cqrs';
import { IrrigationService } from './app/services/irrigation.app.service';
import { Module } from '@nestjs/common';
import { ReadHumidityHandler } from './domain/commands/read-humidity.handler';
import { BoardModule } from '../shared/board/board.module';
import { HumidityReadEventHandler } from './app/services/humidity-read.event.handler';
import { HumidityServiceFactory } from './infrastructure/sensors/soil-humidity/soil-humidity.factory';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'PATRON_SERVICE',
        transport: Transport.MQTT,

        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
    BoardModule,
  ],
  providers: [
    IrrigationService,
    ReadHumidityHandler,
    HumidityReadEventHandler,
    HumidityServiceFactory,
  ],
})
export class IrrigationModule {}
