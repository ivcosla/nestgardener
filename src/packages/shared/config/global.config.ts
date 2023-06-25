import { z } from 'zod';

type FakeBoardPins =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30;

const globalConfig = z.object({
  NODE_ENV: z.string().default('development'),
  THING_ID: z.string(),
  ROOM_ID: z.string(),
  TARGET: z.enum(['local', 'rpi1mB']).default('local'),

  FAKE_BOARD: z.record(z.string(), z.function().returns(z.number())),
});

// GlobalConfig is meant to contain only common required config values that we
// need to access from anywhere in the app, and that need to either be used
// in method decorators (e.g. @MessagePattern) or is useful for running in
// non-board environments (e.g. local dev) and thus don't make sense to inject
// those values as part of the DI configuration
export type GlobalConfig = Omit<z.infer<typeof globalConfig>, 'FAKE_BOARD'> & {
  FAKE_BOARD: Record<`BOARD_TEST_PIN_${FakeBoardPins}`, () => number>;
};

const fakePinArray = Object.fromEntries(
  new Map(
    Array.from({ length: 30 }).map((_, i) => [
      `BOARD_TEST_PIN_${i + 1}`,
      () => {
        const e = process.env[`BOARD_TEST_PIN_${i + 1}`];
        if (e) {
          return Number(e);
        }

        throw new Error(`BOARD_TEST_PIN_${i + 1} -> testing exception`);
      },
    ]),
  ).entries(),
) as Record<`BOARD_TEST_PIN_${FakeBoardPins}`, () => number>;

const originalConfig =
  process.env.NODE_ENV === 'test'
    ? ({
        NODE_ENV: 'test',
        THING_ID: 'test',
        ROOM_ID: 'test',
        TARGET: 'local',
        FAKE_BOARD: fakePinArray,
      } as const)
    : globalConfig.parse({
        NODE_ENV: process.env.NODE_ENV,
        THING_ID: process.env.THING_ID,
        ROOM_ID: process.env.ROOM_ID,
        TARGET: process.env.TARGET,
        FAKE_BOARD: fakePinArray,
      });

export const GLOBAL_CONFIG: GlobalConfig = {
  ...originalConfig,
  FAKE_BOARD: fakePinArray,
};
