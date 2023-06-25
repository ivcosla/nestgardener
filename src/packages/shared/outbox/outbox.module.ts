import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboxService } from './app/outbox.service';
import { OutboxRepository } from './infrastructure/outbox.repository';
import { ScheduleModule } from '@nestjs/schedule';

const mqttClient = ClientsModule.register([
  {
    name: 'MqttClient',
    transport: Transport.MQTT,

    options: {
      url: 'mqtt://localhost:1883',
    },
  },
]);

@Module({
  imports: [mqttClient, ScheduleModule],
  providers: [OutboxService, OutboxRepository],
  exports: [OutboxService, mqttClient],
})
export class OutboxModule {}
