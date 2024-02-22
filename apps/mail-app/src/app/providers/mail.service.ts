import { Injectable } from '@nestjs/common';
import { EnvironmentService, SendEmailNewUserDto } from '@social/common';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  mailService: Mailjet;
  defaultSender: string;
  constructor(private readonly envService: EnvironmentService) {
    const { MAIL_API_TOKEN, MAIL_SECRET_TOKEN, MAIL_DEFAULT_SENDER } =
      this.envService.environment;
    this.mailService = Mailjet.apiConnect(MAIL_API_TOKEN, MAIL_SECRET_TOKEN);
    this.defaultSender = MAIL_DEFAULT_SENDER;
  }
  async sendNewUserMail(data: SendEmailNewUserDto) {
    const text = `Dear ${data.fullName}, welcome to social app!`;

    await this.mailService.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: `${this.defaultSender}`,
            Name: 'Social app',
          },
          To: [
            {
              Email: data.email,
              Name: data.fullName,
            },
          ],
          Subject: 'New user registered',
          TextPart: text,
          HTMLPart: `Dear ${data.fullName}, welcome to social app!`,
        },
      ],
    });
  }
}
