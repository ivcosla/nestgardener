import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TasksRepository } from './infrastructure/task.repository';
import { TasksService } from './app/tasks.service';
import { AddTaskHandler } from './app/commands/add-task.command.handler';
import { DeleteTaskHandler } from './app/commands/delete-task.command.handler';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TaskAddedEventHandler } from './app/event-handlers/task-added.event.handler';
import { TaskDeletedEventHandler } from './app/event-handlers/task-deleted.event.handler';
import { OutboxModule } from '../shared/outbox/outbox.module';

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
