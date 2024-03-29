import { PickType } from '@nestjs/swagger';

import { UserDto } from '../user/user.dto';

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}
