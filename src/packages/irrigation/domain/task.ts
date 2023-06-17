export type ReadHumidityCommand = {
  input:
    | {
        kind: 'gpio';
        gpio: number;
      }
    | {
        kind: 'i2c';
        bus: number;
        address: number;
        base: number;
        channelOffset: number;
      };
};

export type Task = {
  every: string; // cron string
  command: ReadHumidityCommand;
};
