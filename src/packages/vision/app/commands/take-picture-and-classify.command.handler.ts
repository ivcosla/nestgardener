import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { CommandResult } from '../../../../lib/command-bus/command-result';
import { CommandErroredEvent } from '../../../shared/generic-command-module/command-errored.domain.event';
import { PictureClassifiedEvent } from '../events/picture-classified';
import { TakePictureAndClassifyCommand } from './take-picture-and-classify.command';
import { ClassifierService } from '../services/classifier.service';
import { CameraService } from '../../infrastructure/pi-cam.actuator';
import { err, ok } from 'neverthrow';

export type TakePictureAndClassifyHandlerResult = CommandResult<
  {
    data: string;
    $events: [PictureClassifiedEvent];
  },
  {
    $events: [CommandErroredEvent];
  }
>;

@CommandHandler(TakePictureAndClassifyCommand)
export class TakePictureAndClassifyHandler {
  constructor(
    private eventBus: EventBus,
    private cameraService: CameraService,
    private classifierService: ClassifierService,
  ) {}

  async execute(
    command: TakePictureAndClassifyCommand,
  ): Promise<TakePictureAndClassifyHandlerResult> {
    try {
      const picture = await this.cameraService.takePicture();
      const classification = await this.classifierService.classify(picture);

      const event = new PictureClassifiedEvent(
        {
          picture: picture.data.toString(),
          classification,
        },
        {
          ...command.context,
        },
      );

      this.eventBus.publish(event);

      return ok({
        data: classification,
        $events: [event],
      });
    } catch (error) {
      console.log(error);
      const errorEvent = new CommandErroredEvent(command.context, {
        kind: 'exception in take-picture-and-classify',
        error,
      });

      this.eventBus.publish(errorEvent);

      return err({
        $events: [errorEvent],
      });
    }
  }
}
