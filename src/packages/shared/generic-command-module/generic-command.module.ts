import { Module } from '@nestjs/common';
import { CommandErroredHandler } from './command-errored.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MqttClient',
        transport: Transport.MQTT,

        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
  ],
  providers: [CommandErroredHandler],
})
export class GenericCommandModule {}
