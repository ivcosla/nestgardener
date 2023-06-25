import { EventsHandler } from '@nestjs/cqrs';
import { TaskAddedEvent } from '../../domain/events/task-added.event';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { buildSendEventAndReplyToIssuer } from '../../../../lib/event-bus/reply-to-issuer';
import { OutboxService } from '../../../shared/outbox/app/outbox.service';

@EventsHandler(TaskAddedEvent)
export class TaskAddedEventHandler {
  private readonly logger = new Logger(TaskAddedEventHandler.name);

  constructor(
    @Inject('MqttClient') private client: ClientProxy,
    private outbox: OutboxService,
  ) {}

  handle = buildSendEventAndReplyToIssuer('task-added', {
    outbox: this.outbox,
    client: this.client,
    logger: this.logger,
  });
}
