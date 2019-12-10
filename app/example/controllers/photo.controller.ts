import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '../../models/types';
import { RecognizeNumberPlatesCommand } from '../commands/recognize-number-plates.command';

@Controller('photo')
export class PhotoController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseInterceptors(FilesInterceptor('photos'))
  @Post('/upload')
  async recognize(@UploadedFiles() files: UploadedFile[]) {
    const data = await this.commandBus.execute(new RecognizeNumberPlatesCommand(files));

    return data.map(item => {
      const { content, ...res } = item;

      return res;
    });
  }
}
