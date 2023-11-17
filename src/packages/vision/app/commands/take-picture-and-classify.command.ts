import { IssuerContext } from '../../../../lib/command-bus/issuer-context';

export type ITakePictureAndClassifyCommand = {
  context: IssuerContext;
};

export class TakePictureAndClassifyCommand
  implements ITakePictureAndClassifyCommand
{
  public readonly context: IssuerContext;

  constructor(data: ITakePictureAndClassifyCommand) {
    this.context = data.context;
  }
}
