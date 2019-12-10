import { HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Photo } from '../models/photo.model';
import { PhotoController } from './controllers/photo.controller';
import { RecognizeNumberPlatesHandler } from './handlers/recognize-number-plates-handler';
import { NpRecognizeService } from './services/np-recognize.service';

const COMMAND_HANDLERS = [RecognizeNumberPlatesHandler];
const SERVICES = [NpRecognizeService];
const CONTROLLERS = [PhotoController];
const ORM_MODELS = [Photo];

@Module({
  imports: [
    TypeOrmModule.forFeature([...ORM_MODELS]),
    CommonModule,
    HttpModule,
    CqrsModule
  ],
  providers: [...COMMAND_HANDLERS, ...SERVICES],
  controllers: [...CONTROLLERS]
})
export class ExampleModule {}
