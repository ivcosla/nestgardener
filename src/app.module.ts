import { Module } from '@nestjs/common';
import { IrrigationModule } from './packages/irrigation/irrigation.module';
import { IrrigationController } from './packages/irrigation/presentation/irrigation.mqtt.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BoardModule } from './packages/shared/board/board.module';
import { CommandErroredModule } from './packages/shared/command-errored/command.shared.module';
import { ConfigModule } from './packages/shared/config/config.module';

const nestModules = [CqrsModule];
const sharedModules = [BoardModule, CommandErroredModule, ConfigModule];
const globalModules = [ConfigModule];

@Module({
  imports: [
    ...nestModules,
    IrrigationModule,
    ...sharedModules,
    ...globalModules,
  ],
  controllers: [IrrigationController],
})
export class AppModule {}
