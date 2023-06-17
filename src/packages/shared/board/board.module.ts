import { Module } from '@nestjs/common';
import { buildBoardFactory } from './board.service';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [
    {
      provide: 'BoardService',
      useFactory: async (config: ConfigService) => {
        return buildBoardFactory().build({
          kind: config.target === 'local' ? 'fake' : config.target,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['BoardService'],
})
export class BoardModule {}
