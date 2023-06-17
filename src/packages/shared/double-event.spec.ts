import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CqrsModule, EventBus, EventsHandler } from '@nestjs/cqrs';

class Event {}

@EventsHandler(Event)
class EvntHandler {
  async handle(event: Event) {
    console.log('Event handled');
  }
}

@Module({
  imports: [CqrsModule],
  providers: [EvntHandler],
})
class Base {}

describe('double', () => {
  it('should be true', async () => {
    // if we create a microservice, the event is delivered twice
    const app = await NestFactory.createMicroservice(Base);

    // where if we create a regular app, the event is delivered once
    // const app = await NestFactory.create(Base);

    await app.init();

    const eventBus = await app.resolve(EventBus);
    eventBus.publish(new Event());

    // sleep for 0.5 seconds to see if the event is handled
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(true).toBe(true);
  });
});
