import { Entity, Column } from 'typeorm';
import { BaseModel } from './types';

interface RecognitionData {
  numberPlate: string;
  regionName: string;
  arrPoints: number[][];
}

@Entity()
export class Photo extends BaseModel<Photo> {
  @Column({ type: 'bytea' })
  content: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  recognitionData: null | RecognitionData[];
}
