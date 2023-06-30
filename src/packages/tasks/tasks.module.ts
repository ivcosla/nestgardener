import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { OutboxModule } from '../shared/outbox/outbox.module';
import { TasksRepository } from './infrastructure';
import { TasksService } from './domain';
import {
  AddTaskHandler,
  DeleteTaskHandler,
  TaskAddedEventHandler,
  TaskDeletedEventHandler,
} from './app';

@Module({
  imports: [CqrsModule, ScheduleModule, OutboxModule],
  providers: [
    TasksRepository,
    TasksService,
    TaskAddedEventHandler,
    TaskDeletedEventHandler,
    AddTaskHandler,
    DeleteTaskHandler,
    SchedulerRegistry,
  ],
  exports: [TasksService, CqrsModule, ScheduleModule, OutboxModule],
})
export class TasksModule {}
