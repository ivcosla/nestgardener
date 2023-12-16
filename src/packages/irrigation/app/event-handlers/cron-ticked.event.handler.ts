import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import { CronTickedEvent } from '../../../tasks/domain/events/cron-ticked.event';
import {
  TogglePinCommand,
  pinToggledDomainInputSchema,
} from '../commands/toggle-pin.command';
import { pumpWaterCommandInputSchema } from '../../presentation/dto/pump-water-command.mqtt.dto';
import {
  IrrigateIfLowHumidityCommand,
  PumpWaterCommand,
  ReadHumidityCommand,
} from '../commands';
import { readHumidityCommandInputSchema } from '../../presentation/dto/read-humidity-command.mqtt.dto';
import { irrigateIfLowHumidityCommandInputSchema } from '../../presentation/dto/irrigate-if-low-humidity.mqtt.dto';

const irrigationModuleCronSubscriptions = [
  'toggle-pin',
  'pump-water',
  'read-humidity',
  'irrigate-if-low-humidity',
];

@Injectable()
export class IrrigationCronSaga {
  private readonly logger = new Logger(IrrigationCronSaga.name);

  @Saga()
  cronTicked = (events$: Observable<any>): Observable<ICommand | undefined> => {
    return events$.pipe(
      ofType(CronTickedEvent),
      filter((event) =>
        irrigationModuleCronSubscriptions.includes(event.data.commandType),
      ),
      map((event) => {
        switch (event.data.commandType) {
          case 'toggle-pin': {
            this.logger.log('toggle-pin command triggering event received');

            const togglePinCommandInput = pinToggledDomainInputSchema.parse(
              event.data.command,
            ) as TogglePinCommand['input'];
            return new TogglePinCommand(togglePinCommandInput, event.context);
          }

          case 'pump-water': {
            this.logger.log('pump-water command triggering event received');

            const pumpWaterCommandInput = pumpWaterCommandInputSchema.parse(
              event.data.command,
            ) as PumpWaterCommand['input'];
            return new PumpWaterCommand(pumpWaterCommandInput, event.context);
          }

          case 'read-humidity': {
            this.logger.log('read-humidity command triggering event received');

            const readHumidityCommandInput =
              readHumidityCommandInputSchema.parse(
                event.data.command,
              ) as ReadHumidityCommand['input'];

            return new ReadHumidityCommand(
              readHumidityCommandInput,
              event.context,
            );
          }

          case 'irrigate-if-low-humidity': {
            this.logger.log(
              'irrigate-if-low-humidity command triggering event received',
            );

            const irrigateIfLowHumidityCommandInput =
              irrigateIfLowHumidityCommandInputSchema.parse(
                event.data.command,
              ) as IrrigateIfLowHumidityCommand['input'];

            return new IrrigateIfLowHumidityCommand(
              irrigateIfLowHumidityCommandInput,
              event.context,
            );
          }

          default: {
            this.logger.error('unknown event in saga');
          }
        }
      }),
    );
  };
}
