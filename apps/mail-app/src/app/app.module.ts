import { Module } from '@nestjs/common';
import { CommonModule } from '@social/common';

import { MailController } from './controllers/mail.controller';
import { MailService } from './providers/mail.service';

@Module({
  imports: [CommonModule],
  controllers: [MailController],
  providers: [MailService],
})
export class AppModule {}
