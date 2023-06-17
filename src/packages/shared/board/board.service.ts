import five, { Board } from 'johnny-five';
import { GLOBAL_CONFIG } from '../config/global.config';
import { Result, err, ok } from 'neverthrow';

// use this when more boards are supported
type Config = {
  kind: 'rpi1mB' | 'fake';
};

export type Ads1115Pins = 0 | 1 | 2 | 3;

export function buildBoardFactory(): {
  build: (config: Config) => Promise<IBoardService>;
} {
  async function boardForRaspberryPi() {
    // need to lazy load this one or it throws on non-raspberry pi
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Raspi = require('raspi-io').RaspiIO;
    const board = new Board({
      io: new Raspi(),
    });
    const isReady = new Promise((resolve, reject) => {
      board.on('ready', () => {
        this.i2cConfig(30);
        resolve(this);
      });
      board.on('error', () => {
        reject(this);
      });
    });
    await isReady;

    return board;
  }

  async function build(config: Config) {
    if (config.kind === 'fake') {
      return new FakeBoardService();
    }

    return new RpiBoardService(await boardForRaspberryPi());
  }

  return {
    build,
  };
}

export type BoardResult<T> = Result<T, { kind: 'error'; error: Error }>;

export type IBoardService = {
  // GPIO ops
  readGpio: (pin: number) => Promise<BoardResult<number>>;
  writeGpio: (pin: number, value: number) => Promise<BoardResult<undefined>>;

  // TODO: add analog read/write ops
  readAnalogAds1115: (pin: Ads1115Pins) => Promise<BoardResult<number>>;

  // I2C ops
  // I2C is a bus, so we need to specify the address of the device we want to
  // talk to, plus the register we want to read/write to.
  readI2c: (
    address: number,
    register: number,
    bytesToRead: number,
  ) => Promise<BoardResult<number>>;
  writeI2c: (
    address: number,
    register: number,
    bytes: number[],
  ) => Promise<BoardResult<undefined>>;
};

class FakeBoardService implements IBoardService {
  getBoardReadFakeEnv(pin: number | string): number {
    return GLOBAL_CONFIG.FAKE_BOARD[`BOARD_TEST_PIN_${pin}`]();
  }

  async readGpio(pin: number): Promise<BoardResult<number>> {
    try {
      const res = this.getBoardReadFakeEnv(pin);
      return ok(res);
    } catch (e) {
      return err({ kind: 'error', error: e });
    }
  }

  async writeGpio(pin: number, value: number): Promise<BoardResult<undefined>> {
    return ok(undefined);
  }

  async readAnalogAds1115(pin: Ads1115Pins): Promise<BoardResult<number>> {
    return this.readGpio(pin);
  }

  async readI2c(
    address: number,
    register: number,
    bytesToRead: number,
  ): Promise<BoardResult<number>> {
    return this.readGpio(address);
  }

  async writeI2c(
    address: number,
    register: number,
    bytes: number[],
  ): Promise<BoardResult<undefined>> {
    return ok(undefined);
  }
}

class RpiBoardService implements IBoardService {
  constructor(private readonly board: Board) {}

  async readGpio(pin: number): Promise<BoardResult<number>> {
    this.board.io.pinMode(pin, this.board.io.MODES.INPUT);

    return new Promise((resolve, reject) => {
      this.board.io.digitalRead(pin, (err, value) => {
        if (err) {
          resolve(err({ kind: 'error', error: err }));
        } else {
          resolve(ok(value));
        }
      });
    });
  }

  async writeGpio(pin: number, value: number): Promise<BoardResult<undefined>> {
    this.board.io.pinMode(pin, this.board.io.MODES.OUTPUT);

    return new Promise((resolve, reject) => {
      this.board.io.digitalWrite(pin, value, (err) => {
        if (err) {
          resolve(err({ kind: 'error', error: err }));
        } else {
          resolve(ok(undefined));
        }
      });
    });
  }

  async readI2c(
    address: number,
    register: number,
    bytesToRead: number,
  ): Promise<BoardResult<number>> {
    return new Promise((resolve, reject) => {
      this.board.io.i2cRead(address, register, bytesToRead, (err, data) => {
        if (err) {
          resolve(err({ kind: 'error', error: err }));
        } else {
          resolve(ok(data));
        }
      });
    });
  }

  async writeI2c(
    address: number,
    register: number,
    bytes: number[],
  ): Promise<BoardResult<undefined>> {
    return new Promise((resolve, reject) => {
      this.board.io.i2cWrite(address, register, bytes, (err) => {
        if (err) {
          resolve(err({ kind: 'error', error: err }));
        } else {
          resolve(ok(undefined));
        }
      });
    });
  }

  async readAnalogAds1115(pin: Ads1115Pins): Promise<BoardResult<number>> {
    // I don't  understand why there are no exported memebers with the classes
    // that are shown on the docs...

    try {
      const virtual = (new Board() as any).Virtual(
        new (five as any).Expander('ADS1115'),
      );

      const input = virtual.io.analogPins.at(pin);

      const sensor = new five.Sensor({
        pin: input,
        board: virtual,
      });

      let lecture: number;

      const readPromise: Promise<BoardResult<number>> = new Promise(
        (resolve, reject) => {
          sensor.on('change', () => {
            try {
              // also... what the hell is this api that returns a value by
              // hacking "this"?
              lecture = (this as any).value;
              resolve(ok(lecture));
            } catch (e) {
              resolve(err({ kind: 'error', error: e }));
            }
          });
        },
      );

      return readPromise;
    } catch (e) {
      return err({ kind: 'error', error: e });
    }
  }
}
