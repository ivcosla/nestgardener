import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommandErroredEvent } from './command-errored.domain.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GLOBAL_CONFIG } from '../config/global.config';

@EventsHandler(CommandErroredEvent)
export class CommandErroredHandler
  implements IEventHandler<CommandErroredEvent>
{
  constructor(@Inject('PATRON_SERVICE') private client: ClientProxy) {
    console.log('CommandErroredHandler created');
  }
  handle(event: CommandErroredEvent) {
    console.log('Im the event handler handling the event!');

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

    const sendResult = this.client.send(
      `/gardener/${GLOBAL_CONFIG.THING_ID}/events/command-errored`,
      errorEvent,
    );

    if (event.context.issuer === 'thing') {
      const replyToIssuer = this.client.send(
        `/gardener/${event.context.id}/inbox/${event.context.correlationId}`,
        errorEvent,
      );

      replyToIssuer.subscribe((c) => {
        console.log('reply with err to issuer', c);
      });
    }

    sendResult.subscribe((c) => {
      console.log('send err result', c);
    });
  }
}
