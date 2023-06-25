import { TasksRepository } from './task.repository';
import { connection, setupForTest } from '../../../../knexfile';

const db = connection;

beforeAll(async () => {
  await setupForTest();
});

afterAll(async () => {
  await db.destroy();
});

describe('TaskRepository', () => {
  const tasksRepository = new TasksRepository({
    database: db,
  } as any);

  const tasks = [
    {
      id: '1',
      kind: 'cron',
      cron: '* * * * *',
      commandType: 'http',
      command: {
        url: 'https://example.com',
        method: 'get',
      },
      enabled: true,
      updatedAt: new Date(),
    },
    {
      id: '2',
      kind: 'setup',
      commandType: 'http',
      command: {
        url: 'https://example.com',
        method: 'get',
      },
      enabled: true,
      updatedAt: new Date(),
    },
  ] as const;

  beforeAll(async () => {
    await tasksRepository.upsertTask(tasks[0]);
    await tasksRepository.upsertTask(tasks[1]);
  });
  describe('given TasksRepository where we first insert, then get', () => {
    describe('getTasks', () => {
      it('should return all tasks', async () => {
        const retrievedTasks = await tasksRepository.getTasks();

        expect(retrievedTasks).toEqual(
          expect.arrayContaining([
            expect.objectContaining(tasks[0]),
            expect.objectContaining(tasks[1]),
          ]),
        );
      });
    });

    describe('upsertTask', () => {
      it('should update the task', async () => {
        const task = {
          id: '1',
          kind: 'cron',
          cron: '*/5 * * * *',
          commandType: 'http',
          command: {
            url: 'https://example.com',
            method: 'get',
          },
          enabled: true,
          updatedAt: new Date(),
        } as const;

        await tasksRepository.upsertTask(task);

        const result = await tasksRepository.getTask(task.id);

        expect(result).toEqual({
          ...task,
          cron: '*/5 * * * *',
          updatedAt: expect.any(Date),
        });
      });
    });

    describe('deleteTask', () => {
      it('should delete the task', async () => {
        await tasksRepository.deleteTask('1');

        const result = await tasksRepository.getTask('1');

        expect(result).toBeUndefined();
      });
    });

    describe("getTask doesn't exist", () => {
      it('should return undefined', async () => {
        const result = await tasksRepository.getTask('3');

        expect(result).toBeUndefined();
      });
    });

    describe("toggleTask doesn't exist", () => {
      it('should do nothing', async () => {
        await tasksRepository.toggleTask('3', true);

        const result = await tasksRepository.getTask('3');

        expect(result).toBeUndefined();
      });
    });

    describe('toggleTask', () => {
      it('should toggle the task as not enabled', async () => {
        await tasksRepository.toggleTask('2', false);

        const result = await tasksRepository.getTask('2');

        expect(result).toEqual({
          ...tasks[1],
          enabled: false,
        });
      });
      it('should toggle the task as enabled if called again', async () => {
        await tasksRepository.toggleTask('2', true);

        const result = await tasksRepository.getTask('2');

        expect(result).toEqual({
          ...tasks[1],
          enabled: true,
        });
      });
    });
  });
});
