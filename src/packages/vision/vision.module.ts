import { Module } from '@nestjs/common';
import {
  CameraService,
  FakeCameraService,
} from './infrastructure/pi-cam.actuator';
import { ConfigService } from '../shared/config/config.service';
import { ClassifierService } from './app/services/classifier.service';

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
  ],
})
export class VisionModule {}
