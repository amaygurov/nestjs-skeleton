import { Document } from 'mongoose';

export interface ConciergeEmail {
  primary: string;
}

export interface User extends Document {
  readonly email: ConciergeEmail;
  readonly password: string;
}
