import { Inject, Injectable } from '@nestjs/common';
import { IBoardService } from '../../shared/board/board.service';
import { Result, err, ok } from 'neverthrow';

@Injectable()
export class WaterPumpService {
  constructor(@Inject('BoardService') private board: IBoardService) {}

  async pumpFor(
    pin: number,
    duration: number,
  ): Promise<
    Result<
      undefined,
      {
        kind: string;
        error: Error;
      }
    >
  > {
    try {
      await this.board.writeGpio(pin, 1);
      await new Promise((resolve) => setTimeout(resolve, duration));
      await this.board.writeGpio(pin, 0);
      return ok(undefined);
    } catch (error) {
      return err({ kind: 'error', error: error });
    }
  }
}
