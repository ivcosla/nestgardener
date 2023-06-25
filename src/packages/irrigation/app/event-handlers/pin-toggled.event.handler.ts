import { EventsHandler } from '@nestjs/cqrs';
import { PinToggledEvent } from '../../domain/events/pin-toggled.event';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Logger } from '@nestjs/common';
import { buildSendEventAndReplyToIssuer } from '../../../../lib/event-bus/reply-to-issuer';
import { OutboxService } from '../../../shared/outbox/app/outbox.service';

@EventsHandler(PinToggledEvent)
export class PinToggledEventHandler {
  private readonly logger = new Logger(PinToggledEventHandler.name);

  constructor(
    @Inject('MqttClient') private client: ClientProxy,
    private outbox: OutboxService,
  ) {}

  handle = buildSendEventAndReplyToIssuer('pin-toggled', {
    outbox: this.outbox,
    client: this.client,
    logger: this.logger,
  });
}
