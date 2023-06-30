import { Injectable, OnModuleInit } from '@nestjs/common';
import { Task, TaskCron } from './task';
import { TasksRepository } from '../infrastructure/task.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EventBus } from '@nestjs/cqrs';
import { Result, ok, err } from 'neverthrow';
import { CronTickedEvent } from './events/cron-ticked.event';
import { v1 } from 'uuid';

const reshapeTaskIntoCronTickedEvent = (t: TaskCron): CronTickedEvent =>
  new CronTickedEvent(
    {
      commandType: t.commandType,
      command: t.command,
    },
    {
      issuer: 'cron',
      correlationId: v1(),
      date: new Date().toISOString(),
    },
  );

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    private repo: TasksRepository,
    private eventBus: EventBus,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * TODO: This should be called from either main or tasks module.
   * Having onModuleInit functionallity in a service is not a good practice.
   *
   * However, for now, this prevents exposing startAll logic to consumers of the
   * service.
   */
  async onModuleInit(): Promise<void> {
    await this.startAll();
  }

  private async startAll(): Promise<void> {
    const tasks = await this.repo.getTasks();

    const cronJobs = tasks.filter((t) => t.kind === 'cron');
    const setupJobs = tasks.filter((t) => t.kind === 'setup');

    setupJobs
      .map(reshapeTaskIntoCronTickedEvent)
      .forEach(this.eventBus.publish);

    cronJobs.forEach((t: TaskCron) => {
      this.schedulerRegistry.addCronJob(
        t.id,
        new CronJob(
          t.cron,
          () => this.eventBus.publish(reshapeTaskIntoCronTickedEvent(t)),
          undefined,
          true,
        ),
      );
    });
  }

  async getTasks(): Promise<Task[]> {
    return this.repo.getTasks();
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.repo.getTask(id);
  }

  async toggleTask(
    id: string,
    running: boolean,
  ): Promise<
    Result<
      undefined,
      {
        kind: 'error';
        error: Error;
      }
    >
  > {
    const task = await this.repo.getTask(id);

    if (!task) {
      return err({
        kind: 'error',
        error: new Error('Task not found'),
      });
    }

    if (task.kind === 'cron') {
      if (running) {
        this.schedulerRegistry.getCronJob(task.id).start();
      } else {
        this.schedulerRegistry.getCronJob(task.id).stop();
      }
    }

    await this.repo.toggleTask(id, running);

    return ok(undefined);
  }

  async updateTask(task: Task): Promise<void> {
    if (task.kind === 'cron') {
      this.schedulerRegistry.getCronJob(task.id).stop();
      this.schedulerRegistry.deleteCronJob(task.id);
      this.schedulerRegistry.addCronJob(
        task.id,
        new CronJob(
          task.cron,
          () => this.eventBus.publish(reshapeTaskIntoCronTickedEvent(task)),
          undefined,
          true,
        ),
      );
    }

    return this.repo.upsertTask(task);
  }

  async addTask(task: Task): Promise<void> {
    if (task.kind === 'cron') {
      this.schedulerRegistry.addCronJob(
        task.id,
        new CronJob(
          task.cron,
          () => this.eventBus.publish(reshapeTaskIntoCronTickedEvent(task)),
          undefined,
          true,
        ),
      );
    }

    return this.repo.upsertTask(task);
  }

  async deleteTask(id: string): Promise<void> {
    if (this.schedulerRegistry.doesExist('cron', id) === true) {
      this.schedulerRegistry.getCronJob(id).stop();
      this.schedulerRegistry.deleteCronJob(id);
    }

    return this.repo.deleteTask(id);
  }
}
