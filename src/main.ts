import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    },
  );
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  await app.init();
  await app.listen();
}
bootstrap();
