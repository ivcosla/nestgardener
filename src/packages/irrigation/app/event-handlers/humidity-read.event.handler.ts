import { EventsHandler } from '@nestjs/cqrs';
import { HumidityReadEvent } from '../../domain/events/humidity-read.event';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { buildSendEventAndReplyToIssuer } from '../../../../lib/event-bus/reply-to-issuer';
import { OutboxService } from '../../../shared/outbox/app/outbox.service';

@EventsHandler(HumidityReadEvent)
export class HumidityReadEventHandler {
  private readonly logger = new Logger(HumidityReadEventHandler.name);

  constructor(
    @Inject('MqttClient') private client: ClientProxy,
    private outbox: OutboxService,
  ) {}

  handle = buildSendEventAndReplyToIssuer('humidity-read', {
    client: this.client,
    outbox: this.outbox,
    logger: this.logger,
  });
}
