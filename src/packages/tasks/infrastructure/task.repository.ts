import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../shared/config/config.service';
import { Task } from '../domain/task';

type TaskInDB = {
  id: string;
  kind: 'cron' | 'setup';
  cron: string | undefined;
  command_type: string;
  command: string;
  enabled: 0 | 1;
  // date is in unix timestamp
  updated_at: number;
};

const reshapeDbTask = (row: TaskInDB): Task => {
  if (row.kind === 'setup') {
    return {
      id: row.id,
      kind: row.kind,
      commandType: row.command_type,
      command: JSON.parse(row.command),
      updatedAt: new Date(row.updated_at),
      enabled: row.enabled === 1,
    };
  }
  return {
    id: row.id,
    kind: row.kind,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cron: row.cron!,
    commandType: row.command_type,
    command: JSON.parse(row.command),
    updatedAt: new Date(row.updated_at),
    enabled: row.enabled === 1,
  };
};

@Injectable()
export class TasksRepository {
  constructor(private config: ConfigService) {}

  connection = this.config.database;

  async getTasks(): Promise<Task[]> {
    const rows: TaskInDB[] = await this.connection.raw(
      'SELECT * FROM tasks ORDER BY id ASC;',
    );

    return rows.map(reshapeDbTask);
  }

  async getTask(id: string): Promise<Task | undefined> {
    const res: TaskInDB = await this.connection
      .select('*')
      .from('tasks')
      .where({ id })
      .first();

    if (!res) {
      return undefined;
    }

    return reshapeDbTask(res);
  }

  async upsertTask(task: Task): Promise<void> {
    await this.connection.raw(
      `INSERT INTO tasks
       VALUES (:id,:kind,:cron,:commandType,:command,:enabled, :updatedAt)
       ON CONFLICT DO UPDATE SET
            kind=excluded.kind,
            cron=excluded.cron,
            command_type=excluded.command_type,
            command=excluded.command,
            enabled=excluded.enabled,
            updated_at=excluded.updated_at;`,
      {
        id: task.id,
        kind: task.kind,
        cron: task.kind === 'cron' ? task.cron : null,
        commandType: task.commandType,
        command: JSON.stringify(task.command),
        enabled: task.enabled,
        updatedAt: task.updatedAt,
      },
    );
  }

  async deleteTask(id: string): Promise<void> {
    await this.connection.raw(`DELETE FROM tasks WHERE id = :id;`, {
      id,
    });
  }

  async toggleTask(id: string, enabled: boolean): Promise<void> {
    await this.connection.raw(
      `UPDATE tasks SET enabled = :enabled WHERE id = :id;`,
      {
        id,
        enabled,
      },
    );
  }
}
