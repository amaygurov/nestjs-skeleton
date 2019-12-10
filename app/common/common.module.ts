import { HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import * as fs from 'fs';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

const CONFIGS_PATH = `../config/${process.env.NODE_ENV || 'local'}`;
if (fs.existsSync(CONFIGS_PATH)) {
  throw new Error('Config Directory not exist');
}

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, CONFIGS_PATH, '**/!(*.d).{ts,js}')),
    ConfigModule,
    HttpModule,
  ],
  providers: [],
  controllers: [],
})
export class CommonModule {}
