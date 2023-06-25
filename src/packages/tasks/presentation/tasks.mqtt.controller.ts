import { Controller, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddTaskCommand } from '../app/commands/add-task.command';
import { AddTaskHandlerResult } from '../app/commands/add-task.command.handler';
import { AddTaskCommandDto } from './add-task.mqtt.dto';
import { GLOBAL_CONFIG } from '../../shared/config/global.config';
import { DeleteTaskCommand } from '../app/commands/delete-task.command';
import { DeleteTaskCommandHandlerResult } from '../app/commands/delete-task.command.handler';
import { DeleteTaskCommandDto } from './delete-task.mqtt.dto';
import { MqttLoggingInterceptor } from '../../../interceptors/mqtt-logging.interceptor';

const { THING_ID, ROOM_ID } = GLOBAL_CONFIG;

@UseInterceptors(new MqttLoggingInterceptor())
@Controller()
export class TasksController {
  constructor(private commandBus: CommandBus) {}

  @MessagePattern(`/gardener/${ROOM_ID}/${THING_ID}/command/add-task`)
  addTask(@Payload() command: AddTaskCommandDto) {
    this.commandBus.execute<AddTaskCommand, AddTaskHandlerResult>(
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
  deleteTask(@Payload() command: DeleteTaskCommandDto) {
    this.commandBus.execute<DeleteTaskCommand, DeleteTaskCommandHandlerResult>(
      new DeleteTaskCommand(command.input, command.context),
    );
  }
}
