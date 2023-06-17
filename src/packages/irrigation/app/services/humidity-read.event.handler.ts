import { EventsHandler } from '@nestjs/cqrs';
import { HumidityReadEvent } from '../../domain/events/humidity-read.domain.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GLOBAL_CONFIG } from '../../../shared/config/global.config';

@EventsHandler(HumidityReadEvent)
export class HumidityReadEventHandler {
  constructor(@Inject('PATRON_SERVICE') private client: ClientProxy) {}

  async handle(event: HumidityReadEvent) {
    console.log(
      'Im the event HumidityRead handler handling the event!',
      JSON.stringify(event),
    );

    const sendResult = this.client.send(
      `/gardener/${GLOBAL_CONFIG.THING_ID}/events/humidity-read`,
      event,
    );

    if (event.context.issuer === 'thing') {
      const replyToIssuer = this.client.send(
        `/gardener/${event.context.id}/inbox/${event.context.correlationId}`,
        event,
      );

      replyToIssuer.subscribe((c) => {
        console.log('reply to issuer', c);
      });
    }

    sendResult.subscribe((c) => {
      console.log('send result', c);
    });
  }
}
