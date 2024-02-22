import { User } from '@prisma/client';

import { UserDto } from '../../dto/user/user.dto';
import { UserWithoutPasswordDto } from '../../dto/user/user-without-password.dto';

export class UserMapperUtil {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  static toDtoWithoutPassword(user: User): UserWithoutPasswordDto {
    return {
      id: user.id,
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  static toDtos(users: User[]): UserWithoutPasswordDto[] {
    return users.map((user) => this.toDtoWithoutPassword(user));
  }
}
