import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveService } from './app/keepalive.service';

@Module({
  imports: [CqrsModule, ScheduleModule],
  providers: [KeepAliveService],
})
export class KeepAliveModule {}
