import { EventsHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { buildSendEventAndReplyToIssuer } from '../../../../lib/event-bus/reply-to-issuer';
import { TaskDeletedEvent } from '../../domain/events/task-deleted.event';
import { OutboxService } from '../../../shared/outbox/app/outbox.service';

@EventsHandler(TaskDeletedEvent)
export class TaskDeletedEventHandler {
  private readonly logger = new Logger(TaskDeletedEvent.name);

  constructor(
    @Inject('MqttClient') private client: ClientProxy,
    private outbox: OutboxService,
  ) {}

  handle = buildSendEventAndReplyToIssuer('task-deleted', {
    outbox: this.outbox,
    client: this.client,
    logger: this.logger,
  });
}
