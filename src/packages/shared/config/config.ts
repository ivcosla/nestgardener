import { z } from 'zod';
import { GLOBAL_CONFIG } from './global.config';
import { Knex } from 'knex';
import { connection } from '../../../../knexfile';

const configSchema = z.object({
  env: z.enum(['development', 'test']).default('development'),
  roomId: z.string(),
  thingId: z.string(),
  target: z.enum(['local', 'rpi1mB']),
  wifi: z.object({
    ssid: z.string(),
    password: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema> & {
  database: Knex;
};

export const buildConfig = () => {
  const config: Config = {
    env: GLOBAL_CONFIG.NODE_ENV as any,
    target: GLOBAL_CONFIG.TARGET,
    roomId: GLOBAL_CONFIG.ROOM_ID,
    thingId: GLOBAL_CONFIG.THING_ID,
    database: connection,
    wifi: {
      ssid: process.env.WIFI_SSID ?? '',
      password: process.env.WIFI_PASSWORD ?? '',
    },
  };

  configSchema.parse(config);

  return config;
};
