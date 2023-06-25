import { Module } from '@nestjs/common';
import { IrrigationModule } from './packages/irrigation/irrigation.module';
import { IrrigationController } from './packages/irrigation/presentation/irrigation.mqtt.controller';
import { CommandErroredModule } from './packages/shared/command-errored/command.shared.module';
import { ConfigModule } from './packages/shared/config/config.module';
import { TasksController } from './packages/tasks/presentation/tasks.controller.mqtt';
import { TasksModule } from './packages/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveModule } from './packages/keepalive/keepalive.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

const nestModules = [ScheduleModule.forRoot()];
const appModules = [IrrigationModule, TasksModule, KeepAliveModule];
const sharedModules = [CommandErroredModule];
const globalModules = [ConfigModule];
const providers = [
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
];

@Module({
  imports: [...nestModules, ...appModules, ...sharedModules, ...globalModules],
  providers,
  controllers: [IrrigationController, TasksController],
})
export class AppModule {}
