import { OmitType } from '@nestjs/swagger';

import { SessionDto } from './session.dto';

export class CreateSessionDto extends OmitType(SessionDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
