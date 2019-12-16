import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    email: {
      primary: String
    },
    password: String
  },
  { collection: 'user' }
);

