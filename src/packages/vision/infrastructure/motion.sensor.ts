import { Inject, Injectable } from '@nestjs/common';
import { IBoardService } from '../../shared/board/board.service';
import { Result, err, ok } from 'neverthrow';

@Injectable()
export class MotionSensor {
  constructor(@Inject('BoardService') private readonly board: IBoardService) {}

  async isMotionDetected(
    pin: number,
  ): Promise<Result<boolean, { kind: string; error: Error }>> {
    const res = await this.board.readGpio(pin);
    if (res.isErr()) {
      return err(res.error);
    }

    return ok(res.value === 1);
  }
}
