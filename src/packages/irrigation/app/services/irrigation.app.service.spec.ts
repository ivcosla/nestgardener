import { CqrsModule } from '@nestjs/cqrs';
import { IrrigationService } from './irrigation.app.service';
import { Test } from '@nestjs/testing';
import { ReadHumidityHandler } from '../commands/read-humidity.command.handler';
import { BoardModule } from '../../../shared/board/board.module';
import { ok } from 'neverthrow';
import { HumidityServiceFactory } from '../../infrastructure/soil-humidity.factory';

describe('IrrigationAppService', () => {
  it('should be true', async () => {
    const mod = await Test.createTestingModule({
      imports: [CqrsModule, BoardModule],
      providers: [
        IrrigationService,
        ReadHumidityHandler,
        HumidityServiceFactory,
      ],
    })
      .overrideModule(BoardModule)
      .useModule({
        module: BoardModule,
        providers: [
          {
            provide: 'BoardService',
            useValue: {
              readAnalogAds1115: () => ok(1),
            },
          },
        ],
      })
      .compile();

    await mod.init();

    const service = mod.get<IrrigationService>(IrrigationService);

    const result = await service.readHumidity(4);

    expect(result).toBeGreaterThan(0);
  });
});
