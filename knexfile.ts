import { knex } from 'knex';

const config = {
  client: 'better-sqlite3',
  connection: {
    filename:
      process.env.NODE_ENV === 'test' ? ':memory:' : './database/mydb.sqlite',
  },
  migrations: {
    tableName: 'migrations',
    directory: './src/migrations',
  },
  // required by sqlite since it does not supports default values
  useNullAsDefault: true,
};

export const connection = knex(config);

export const setupForTest = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupForTest should only be called in test environment');
  }

  await connection.migrate.latest({
    directory: './src/migrations',
  });
};

export default config;
