import { Injectable } from '@nestjs/common';
import { Config } from './config';

@Injectable()
export class ConfigService implements Config {
  env: Config['env'];
  roomId: string;
  thingId: string;
  target: 'local' | 'rpi1mB';
  wifi: {
    ssid: string;
    password: string;
  };
  database: import('knex').Knex<any, unknown[]>;
}
