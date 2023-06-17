import { Injectable } from '@nestjs/common';
import { GLOBAL_CONFIG } from './global.config';

@Injectable()
export class ConfigService {
  env: string = GLOBAL_CONFIG.NODE_ENV;
  target: 'local' | 'rpi1mB' = GLOBAL_CONFIG.TARGET;
}
