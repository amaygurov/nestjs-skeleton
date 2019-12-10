import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NpRecognizeService {

  constructor(private readonly httpService: HttpService, private readonly config: ConfigService) {
  }

  async recognize(buffers: Buffer[]) {
    const requests = buffers.map(buffer => this.httpService.put(this.config.get('app.services.recognizer'), buffer));

    return forkJoin(requests).pipe(map(responses => responses.map(response => response.data))).toPromise();
  }
}
