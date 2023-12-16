import { err, ok } from 'neverthrow';
import wifi from 'node-wifi';
import { ConfigService } from '../../shared/config/config.service';
import { EventBus } from '@nestjs/cqrs';
import { WifiReconnectedEvent } from '../events/wifi-reconnected.event';
import { v1 } from 'uuid';
import { WifiFailedToReconectEvent } from '../events/wifi-failed-to-reconnect.event';
import { Cron } from '@nestjs/schedule';
import ping from 'ping';
import { Injectable } from '@nestjs/common';

async function tryReconnectWifi(config: { ssid: string; password: string }) {
  const { ssid, password } = config;

  try {
    await wifi.connect({
      ssid,
      password,
    });

    return ok(undefined);
  } catch (e) {
    return err({
      kind: 'error',
      error: e,
    });
  }
}

@Injectable()
export class KeepAliveService {
  constructor(
    private readonly config: ConfigService,
    private readonly eventBus: EventBus,
  ) {}

  hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

  @Cron('*/5 * * * *')
  async keepAlive() {
    if (this.config.target === 'local') {
      return;
    }

    const results = await Promise.all(
      this.hosts.map((h) => ping.promise.probe(h)),
    );
    if (results.some((r) => r.alive)) {
      return;
    }

    const result = await tryReconnectWifi({
      ssid: this.config.wifi.ssid,
      password: this.config.wifi.password,
    });

    const context = {
      issuer: 'service',
      who: 'keepalive',
      date: new Date().toISOString(),
      correlationId: v1(),
    } as const;

    const data = {
      observedAt: new Date(),
    };

    result
      .map(() => {
        this.eventBus.publish(new WifiReconnectedEvent(data, context));
      })
      .mapErr((e) => {
        this.eventBus.publish(
          new WifiFailedToReconectEvent(
            {
              ...data,
              error: e,
            },
            context,
          ),
        );
      });
  }
}
