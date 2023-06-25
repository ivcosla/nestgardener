import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.init();
  await app.startAllMicroservices();
  await app.listen(8093);
}
bootstrap();
