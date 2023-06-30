import { Injectable } from '@nestjs/common';
import mobilenet from '@tensorflow-models/mobilenet';

@Injectable()
export class ClassifierService {
  private model: Awaited<ReturnType<typeof mobilenet.load>> | undefined;

  async classify(image: ImageData): Promise<string> {
    if (!this.model) {
      this.model = await mobilenet.load();
    }

    const predictions = await this.model.classify(image);

    return predictions[0].className;
  }
}
