import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../../models/photo.model';
import { RecognizeNumberPlatesCommand } from '../commands/recognize-number-plates.command';
import { NpRecognizeService } from '../services/np-recognize.service';

@CommandHandler(RecognizeNumberPlatesCommand)
export class RecognizeNumberPlatesHandler implements ICommandHandler<RecognizeNumberPlatesCommand> {
  constructor(
    @InjectRepository(Photo)
    private readonly repository: Repository<Photo>,
    private readonly recognizer: NpRecognizeService,
  ) {}

  async execute(command: RecognizeNumberPlatesCommand) {
    const { files } = command;

    const responses = await this.recognizer.recognize(files.map(file => file.buffer));
    const photos = responses.map((response, index) => new Photo({
      recognitionData: response,
      content: '\\x' + (files[index].buffer ? files[index].buffer.toString('hex') : ''),
    }));

    return await this.repository.save(photos);
  }
}
