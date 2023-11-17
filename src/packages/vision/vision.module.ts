import { Module } from '@nestjs/common';
import {
  CameraService,
  FakeCameraService,
} from './infrastructure/pi-cam.actuator';
import { ConfigService } from '../shared/config/config.service';
import { ClassifierService } from './app/services/classifier.service';
import { TakePictureAndClassifyHandler } from './app/commands/take-picture-and-classify.command.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [
    {
      provide: CameraService,
      useFactory: (config: ConfigService) => {
        if (['local', 'test'].includes(config.env)) {
          return new FakeCameraService();
        }

        return new CameraService();
      },
    },
    ClassifierService,
    TakePictureAndClassifyHandler,
  ],
  exports: [CqrsModule],
})
export class VisionModule {}
