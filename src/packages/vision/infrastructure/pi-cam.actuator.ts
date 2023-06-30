import { StillCamera } from 'pi-camera-connect';

export class CameraService implements ICameraService {
  private readonly camera: StillCamera;

  constructor() {
    this.camera = new StillCamera();
  }

  async takePicture(): Promise<ImageData> {
    const image = await this.camera.takeImage();

    return new ImageData(new Uint8ClampedArray(image), 1920, 1080);
  }
}

export type ICameraService = {
  takePicture(): Promise<ImageData>;
};

export class FakeCameraService implements ICameraService {
  async takePicture(): Promise<ImageData> {
    return new ImageData(1920, 1080);
  }
}
