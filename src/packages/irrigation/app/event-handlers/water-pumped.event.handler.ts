import { EventsHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { buildSendEventAndReplyToIssuer } from '../../../../lib/event-bus/reply-to-issuer';
import { OutboxService } from '../../../shared/outbox/app/outbox.service';
import { WaterPumpedEvent } from '../../domain/events/water-pumped.event';

@EventsHandler(WaterPumpedEvent)
export class WaterPumpedEventHandler {
  private readonly logger = new Logger(WaterPumpedEventHandler.name);

  constructor(
    @Inject('MqttClient') private client: ClientProxy,
    private outbox: OutboxService,
  ) {}

  handle = buildSendEventAndReplyToIssuer('water-pumped', {
    client: this.client,
    outbox: this.outbox,
    logger: this.logger,
  });
}
