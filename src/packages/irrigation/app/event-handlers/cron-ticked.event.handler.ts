import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import { CronTickedEvent } from '../../../tasks/domain/events/cron-ticked.event';
import {
  TogglePinCommand,
  pinToggledDomainInputSchema,
} from '../commands/toogle-pin.command';

const irrigationModuleCronSubscriptions = ['toggle-pin'];

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
            const togglePinCommandInput = pinToggledDomainInputSchema.parse(
              event.data.command,
            ) as TogglePinCommand['input'];
            return new TogglePinCommand(togglePinCommandInput, event.context);
          }
          default: {
            this.logger.error('unknown event in saga');
          }
        }
      }),
    );
  };
}
