import { Result } from 'neverthrow';
import { I2cCapacitiveSoilHumidityService } from './i2c-capacitive-soil-humidity.sensor.service';
import { IBoardService } from '../../../shared/board/board.service';
import { Inject, Injectable } from '@nestjs/common';

export type SoilHumidityService = {
  read: (
    pinOrAddress: number,
    opts?: {
      reg?: number;
      toWrite?: number[];
      toRead?: number;
    },
  ) => Promise<Result<number, { kind: string; error: Error }>>;
};

@Injectable()
export class HumidityServiceFactory {
  constructor(@Inject('BoardService') private board: IBoardService) {}

  create(type: 'ads1115'): SoilHumidityService {
    switch (type) {
      case 'ads1115':
        return new I2cCapacitiveSoilHumidityService(this.board);
      default:
        throw new Error(`Unknown soil humidity sensor type: ${type}`);
    }
  }
}
