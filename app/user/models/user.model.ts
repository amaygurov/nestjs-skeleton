import { Entity, Column, BeforeInsert } from 'typeorm';
import { USER_ROLES, BaseModel, Username, UserRole, HashString } from '../../models/types';

import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseModel<User> {

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: Username;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: HashString;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
  })
  role: UserRole;

  @Column({
    default: true,
  })
  active: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
