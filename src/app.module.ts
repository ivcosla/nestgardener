import 'dotenv/config';

import { BadRequestException, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

import { IrrigationController, IrrigationModule } from './packages/irrigation';
import { KeepAliveModule } from './packages/keepalive/keepalive.module';
import { ConfigModule } from './packages/shared/config/config.module';
import { GenericCommandModule } from './packages/shared/generic-command-module/generic-command.module';
import { TasksController, TasksModule } from './packages/tasks';

import { MqttLoggingInterceptor } from './interceptors/mqtt-logging.interceptor';

const ZodValidationPipeWithErrLogging = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    console.log('error', JSON.stringify(error));
    return new BadRequestException('ValidationError');
  },
});

const nestModules = [ScheduleModule.forRoot()];
const appModules = [IrrigationModule, TasksModule, KeepAliveModule];
const sharedModules = [GenericCommandModule];
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
  exports: [...nestModules],
})
export class AppModule {}
