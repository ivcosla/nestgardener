import {
  Ads1115Pins,
  IBoardService,
} from '../../../../shared/board/board.service';
import { SoilHumidityService } from './soil-humidity.factory';
import { Result } from 'neverthrow';

export class I2cCapacitiveSoilHumidityService implements SoilHumidityService {
  constructor(private board: IBoardService) {}

  async read(
    pinOrAddress: Ads1115Pins,
  ): Promise<Result<number, { kind: string; error: Error }>> {
    return this.board.readAnalogAds1115(pinOrAddress);
  }
}
