import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EventForOutbox, EventInOutbox } from '../domain/outbox-event';

@Injectable()
export class OutboxRepository {
  constructor(private readonly config: ConfigService) {}

  async save(event: EventForOutbox): Promise<void> {
    const connection = this.config.database;
    const { topic, payload } = event;

    return connection.raw(
      `
      INSERT INTO outbox (topic, payload)
      VALUES (:topic, :payload);`,
      {
        topic,
        payload: JSON.stringify(payload),
      },
    );
  }

  async getUnsentEvents(): Promise<EventInOutbox[]> {
    const connection = this.config.database;
    const rows = await connection.raw(
      `SELECT id, topic, payload FROM outbox
       WHERE sent = 0 
       ORDER BY id ASC;`,
    );

    return rows.map((row) => ({
      id: row.id,
      topic: row.topic,
      payload: JSON.parse(row.payload),
    }));
  }

  async markAsSent(ids: number[]): Promise<void> {
    const connection = this.config.database;
    await connection.raw(
      `UPDATE outbox
            SET sent = 1
            WHERE id IN (${ids.join(',')});`,
    );
  }

  async deleteSentEvents(): Promise<void> {
    const connection = this.config.database;
    await connection.raw(
      `DELETE FROM outbox
       WHERE sent = true;`,
    );
  }
}
