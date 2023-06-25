import { Injectable } from '@nestjs/common';
import { GLOBAL_CONFIG } from './global.config';
import { Knex } from 'knex';
import { connection } from '../../../../knexfile';

@Injectable()
export class ConfigService {
  env: string = GLOBAL_CONFIG.NODE_ENV;
  target: 'local' | 'rpi1mB' = GLOBAL_CONFIG.TARGET;
  database: Knex = connection;
  wifi: {
    ssid: string;
    password: string;
  };
}
