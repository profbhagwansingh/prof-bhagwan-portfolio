import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Security: HTTP headers ────────────────────────────────────────────────
  // Helmet sets secure HTTP headers (XSS, clickjacking, MIME-sniffing, etc.)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL ?? 'http://localhost:3000'],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow loading images from external origins
  }));

  // ── Security: CORS ────────────────────────────────────────────────────────
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger / OpenAPI Documentation ───────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Prof. Bhagwan Singh — Portfolio API')
    .setDescription(
      'RESTful API for the academic portfolio platform. ' +
      'Provides public content endpoints and authenticated admin CRUD operations.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication & Authorization')
    .addTag('content', 'Hero, About, Timeline, Courses, Achievements, Scholars, Announcements, Social Links')
    .addTag('publications', 'Journal Publications & Books')
    .addTag('gallery', 'Gallery Categories & Items')
    .addTag('submissions', 'Contact & Alumni Form Submissions')
    .addTag('media', 'File Upload & Management')
    .addTag('settings', 'Site Settings & SEO Metadata')
    .addTag('users', 'User Management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
  logger.log('📚 Swagger docs available at /api/docs');

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📦 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
