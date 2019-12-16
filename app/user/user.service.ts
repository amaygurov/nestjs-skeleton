import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>
  ) {}

  async findByEmail(email: string): Promise<User> {
    console.log(await this.userModel.findOne({ }).exec());
    return await this.userModel.findOne({ 'email.primary': email }).exec();
  }
}
