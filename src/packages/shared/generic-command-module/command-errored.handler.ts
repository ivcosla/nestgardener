import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommandErroredEvent } from './command-errored.domain.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GLOBAL_CONFIG } from '../config/global.config';

@EventsHandler(CommandErroredEvent)
export class CommandErroredHandler
  implements IEventHandler<CommandErroredEvent>
{
  constructor(@Inject('MqttClient') private client: ClientProxy) {}

  handle(event: CommandErroredEvent) {
    const errorEvent = {
      ...event,
      error: {
        kind: event.error.kind,
        stack: JSON.stringify(
          event.error.error,
          Object.getOwnPropertyNames(event.error.error),
        ),
      },
    };

    this.client
      .send(
        `/gardener/${GLOBAL_CONFIG.ROOM_ID}/${GLOBAL_CONFIG.THING_ID}/events/command-errored`,
        errorEvent,
      )
      .subscribe();

    if (event.context.issuer === 'thing') {
      this.client
        .send(
          `/gardener/${event.context.id}/inbox/${event.context.correlationId}`,
          errorEvent,
        )
        .subscribe();
    }
  }
}
