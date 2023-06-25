type TaskCommon = {
  id: string;
  commandType: string;
  command: Record<string, unknown>;
  enabled: boolean;
  updatedAt: Date;
};

export type TaskCron = TaskCommon & {
  kind: 'cron';
  cron: string;
};

export type TaskSetup = TaskCommon & {
  kind: 'setup';
};

export type Task = TaskCron | TaskSetup;
