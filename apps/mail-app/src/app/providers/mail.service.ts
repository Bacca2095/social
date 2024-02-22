import { Injectable } from '@nestjs/common';
import { SendEmailNewUserDto } from '@social/common';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
  mailService: Mailjet;
  constructor() {
    this.mailService = Mailjet.apiConnect(
      process.env['MAIL_API'],
      process.env['MAIL_SECRET']
    );
  }
  async sendNewUserMail(data: SendEmailNewUserDto) {
    const text = `Dear ${data.fullName}, welcome to social app!`;

    await this.mailService.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'bacca2095@gmail.com',
            Name: 'Social app',
          },
          To: [
            {
              Email: 'cesarbaccadev@gmail.com',
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
