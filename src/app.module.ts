import 'dotenv/config';
import { BadRequestException, Module } from '@nestjs/common';
import { IrrigationModule } from './packages/irrigation/irrigation.module';
import { IrrigationController } from './packages/irrigation/presentation/irrigation.mqtt.controller';
import { CommandErroredModule } from './packages/shared/command-errored/command.shared.module';
import { ConfigModule } from './packages/shared/config/config.module';
import { TasksController } from './packages/tasks/presentation/tasks.mqtt.controller';
import { TasksModule } from './packages/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveModule } from './packages/keepalive/keepalive.module';
import { APP_PIPE } from '@nestjs/core';
import { createZodValidationPipe } from 'nestjs-zod';
import { MqttLoggingInterceptor } from './interceptors/mqtt-logging.interceptor';
import { ZodError } from 'zod';

const ZodValidationPipeWithErrLogging = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    console.log('error', JSON.stringify(error));
    return new BadRequestException('ValidationError');
  },
});

const nestModules = [ScheduleModule.forRoot()];
const appModules = [IrrigationModule, TasksModule, KeepAliveModule];
const sharedModules = [CommandErroredModule];
const globalModules = [ConfigModule.forRoot()];
const providers = [
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipeWithErrLogging,
  },
  MqttLoggingInterceptor,
];

@Module({
  imports: [...nestModules, ...appModules, ...sharedModules, ...globalModules],
  providers,
  controllers: [IrrigationController, TasksController],
})
export class AppModule {}
