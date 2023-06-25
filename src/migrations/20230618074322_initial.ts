import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.raw(`
        CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        cron TEXT,
        command_type TEXT NOT NULL,
        command TEXT NOT NULL,
        enabled BOOLEAN NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await trx.raw(`
    CREATE TABLE outbox (
      id INTEGER PRIMARY KEY ASC,
      sent BOOLEAN NOT NULL DEFAULT FALSE,
      topic TEXT NOT NULL,
      payload TEXT NOT NULL
    )`);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.raw(`DROP TABLE tasks;`);
    await trx.raw(`DROP TABLE outbox;`);
  });
}
