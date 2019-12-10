import { UserService } from '../user.service';
import { Controller } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(public service: UserService) {}
}
