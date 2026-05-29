import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { UsersModule } from './users/users.module';

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

    /**
     * ThrottlerModule — Rate limiting for all routes.
     *
     * Default: 100 requests per 60 seconds per IP.
     * Individual routes can override with @Throttle() decorator.
     * Login endpoint should be further restricted (5/min).
     * Contact/Alumni forms: 10/min.
     */
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,   // 60 seconds
        limit: 100,   // 100 requests per minute per IP
      },
    ]),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads/',
      serveStaticOptions: {
        cacheControl: true,
        maxAge: '30d',
      },
    }),

    PrismaModule,
    AuthModule,
    ContentModule,
    PublicationsModule,
    GalleryModule,
    SubmissionsModule,
    MediaModule,
    SettingsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    /**
     * Apply ThrottlerGuard globally — every route is rate-limited
     * unless explicitly skipped with @SkipThrottle().
     */
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
