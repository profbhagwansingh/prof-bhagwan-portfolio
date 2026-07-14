import { Module } from '@nestjs/common';
import { EcrrbController } from './ecrrb.controller';
import { EcrrbService } from './ecrrb.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [EcrrbController],
  providers: [EcrrbService],
})
export class EcrrbModule {}
