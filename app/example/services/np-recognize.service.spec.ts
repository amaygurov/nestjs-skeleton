import { Test, TestingModule } from '@nestjs/testing';
import { NpRecognizeService } from './np-recognize.service';

describe('NpRecognizeService', () => {
  let service: NpRecognizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NpRecognizeService],
    }).compile();

    service = module.get<NpRecognizeService>(NpRecognizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
