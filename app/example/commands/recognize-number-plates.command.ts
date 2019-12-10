import { UploadedFile } from '../../models/types';

export class RecognizeNumberPlatesCommand {
  constructor(
    public readonly files: UploadedFile[],
  ) {}
}
