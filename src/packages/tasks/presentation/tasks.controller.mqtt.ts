import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { AddTaskCommand } from '../app/commands/add-task.command';
import { AddTaskHandlerResult } from '../app/commands/add-task.command.handler';
import { AddTaskCommandDto } from './add-task.mqtt.dto';
import { GLOBAL_CONFIG } from '../../shared/config/global.config';
import { DeleteTaskCommand } from '../app/commands/delete-task.command';
import { DeleteTaskCommandHandlerResult } from '../app/commands/delete-task.command.handler';
import { DeleteTaskCommandDto } from './delete-task.mqtt.dto';

const { THING_ID, ROOM_ID } = GLOBAL_CONFIG;

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private commandBus: CommandBus) {}

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/add-task`)
  async addTask(
    @Payload() command: AddTaskCommandDto,
    @Ctx() context: MqttContext,
  ) {
    this.logger.log(`Received message from ${context.getTopic()}`);

    await this.commandBus.execute<AddTaskCommand, AddTaskHandlerResult>(
      new AddTaskCommand(
        {
          ...command.input,
          enabled: true,
          updatedAt: new Date(),
        },
        command.context,
      ),
    );
  }

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/delete-task`)
  async deleteTask(
    @Payload() command: DeleteTaskCommandDto,
    @Ctx() context: MqttContext,
  ) {
    this.logger.log(`Received message from ${context.getTopic()}`);

    await this.commandBus.execute<
      DeleteTaskCommand,
      DeleteTaskCommandHandlerResult
    >(new DeleteTaskCommand(command.input, command.context));
  }
}
