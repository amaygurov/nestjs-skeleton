import { PrimaryGeneratedColumn } from 'typeorm';

export const USER_ROLES = ['admin'] as const;

export type UserRole = typeof USER_ROLES[number];
export type Base64Image = string;
export type Email = string;
export type Username = string;
export type Phone = string;
export type HashString = string;

export interface UploadedFile {
  fieldname: string;
  filename: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class BaseModel<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor(record?: Partial<T>) {
    if (record) {
      Object.assign(this, record);
    }
  }
}
