import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GLOBAL_CONFIG } from '../../packages/shared/config/global.config';
import { IEvent } from '@nestjs/cqrs';
import { IssuerContext } from '../command-bus/issuerContext';
import { OutboxService } from '../../packages/shared/outbox/app/outbox.service';

type Dependencies = {
  client: Pick<ClientProxy, 'send'>;
  outbox: OutboxService;
  logger: Logger;
};

type AnswerableEvent = IEvent & {
  data: unknown;
  context: IssuerContext;
};

/**
 * Builds a function that handles an event and sends it to the event bus, and
 * if the issuer of the command was another service, replies to it via mqtt
 *
 * @param event The event class to handle
 * @param nameInTopic The last part of the events topic: IEx.: foo in
 * "/gardener/../events/foo"
 * @param dependencies ClientProxy to reply back to issuer and Logger
 * @returns A function that handles the event, to be used in the EventsHandler
 */
export const buildSendEventAndReplyToIssuer = (
  nameInTopic: string,
  dependencies: Dependencies,
) => {
  const { client, logger } = dependencies;

  return async function handle<Event extends AnswerableEvent>(event: Event) {
    const className = event.constructor.name;
    logger.log('Event handler for event: ' + className);

    await dependencies.outbox.send({
      payload: event,
      topic: `/gardener/${GLOBAL_CONFIG.ROOM_ID}/${GLOBAL_CONFIG.THING_ID}/events/${nameInTopic}`,
    });

    if (event.context.issuer === 'thing') {
      const replyToIssuer = client.send(
        `/gardener/${event.context.id}/inbox/${event.context.correlationId}`,
        {
          data: event.data,
          event: nameInTopic,
          context: event.context,
        },
      );

      replyToIssuer.subscribe((c) => {
        logger.warn(`${className} event handler reply to issuer got: `, c);
      });
    }
  };
};
