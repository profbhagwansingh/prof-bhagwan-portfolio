import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Security: HTTP headers ────────────────────────────────────────────────
  // Helmet sets secure HTTP headers (XSS, clickjacking, MIME-sniffing, etc.)
  app.use(helmet());

  // ── Security: CORS ────────────────────────────────────────────────────────
  // Allow requests only from your Next.js frontend origin.
  // In development, FRONTEND_URL defaults to localhost:3001 so the backend
  // (on :3000) can talk to the frontend without browser CORS errors.
  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Validation: Global pipe ───────────────────────────────────────────────
  // Automatically validates every incoming request body against its DTO.
  // whitelist: strips any property not declared in the DTO (prevents mass-assignment).
  // forbidNonWhitelisted: returns 400 if unknown properties are sent.
  // transform: auto-converts plain JS objects into DTO class instances
  //            (needed for class-validator decorators to work at runtime).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Global API prefix ─────────────────────────────────────────────────────
  // All routes will be under /api/... (e.g. POST /api/auth/login).
  // Note: auth.controller.ts already prefixes with 'api/auth' — if you add
  // this global prefix, remove the 'api/' from the individual controllers
  // to avoid /api/api/auth/login. For now this is left commented out until
  // controllers are updated.
  //
  // app.setGlobalPrefix('api');

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  // Enables NestJS lifecycle hooks (OnModuleDestroy) so PrismaService can
  // cleanly disconnect from the database on SIGTERM (e.g. Docker stop).
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📦 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
