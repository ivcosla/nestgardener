import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { buildConfig } from './config';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: buildConfig(),
        },
      ],
      exports: [ConfigService],
    };
  }
}
