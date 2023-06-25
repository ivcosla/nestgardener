import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OutboxRepository } from '../infrastructure/outbox.repository';
import { ClientProxy } from '@nestjs/microservices';
import { EventForOutbox } from '../domain/outbox-event';
import { Cron } from '@nestjs/schedule';

/**
 * This service is reponsible for buffering events into database.
 *
 * It is also responsible for pulling the unsent events and sending them to
 * the message broker, then deleting them.
 *
 * This whole procedure is triggered via the sendOutbox private function.
 *
 * Such function is invoked when send is called with an event, meaning that
 * when we want to send an event we actually buffer it, then immediately
 * consume the buffer.
 *
 * This guarantees that event sending attempts are ignored when network is down,
 * and we will eventually deliver the event when the network is back up.
 *
 * Additionally, the consume from buffer logic is executed on device startup
 * and every 5 minutes.
 */
@Injectable()
export class OutboxService implements OnModuleInit {
  constructor(
    private readonly repository: OutboxRepository,
    @Inject('MqttClient') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.sendOutbox();
  }

  @Cron('*/5 * * * *')
  private async sendOutbox() {
    const events = await this.repository.getUnsentEvents();

    for (const event of events) {
      try {
        this.client.send(event.topic, event.payload).subscribe();
      } catch (e) {
        continue;
      }

      try {
        await this.repository.markAsSent([event.id]);
      } catch (e) {
        continue;
      }
    }

    await this.repository.deleteSentEvents();
  }

  async send(event: EventForOutbox) {
    await this.repository.save(event);
    await this.sendOutbox();
  }
}
