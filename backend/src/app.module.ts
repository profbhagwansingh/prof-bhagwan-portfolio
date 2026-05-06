import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { PublicationsModule } from './publications/publications.module';
import { GalleryModule } from './gallery/gallery.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { MediaModule } from './media/media.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    /**
     * ConfigModule MUST be first and isGlobal: true.
     *
     * WHY: JwtStrategy, AuthModule.registerAsync, and PrismaService all
     * depend on environment variables. Without ConfigModule loaded first,
     * ConfigService throws "No provider for ConfigService" and
     * process.env is empty because dotenv hasn't run yet.
     *
     * isGlobal: true means you never need to import ConfigModule again
     * in any child module — it's available everywhere automatically.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true, // Caches env lookups for a small perf win
    }),

    PrismaModule,
    AuthModule,
    ContentModule,
    PublicationsModule,
    GalleryModule,
    SubmissionsModule,
    MediaModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
