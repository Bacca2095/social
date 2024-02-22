import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailCommand, SendEmailNewUserDto } from '@social/common';

import { MailService } from '../providers/mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(MailCommand.SEND_NEW_USER_MAIL)
  sendNewUserMail(@Payload() data: SendEmailNewUserDto) {
    this.mailService.sendNewUserMail(data);
  }
}
