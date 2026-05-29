import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

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
    crossOriginEmbedderPolicy: false,
  }));

  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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

  app.enableShutdownHooks();

  // ── Auto-seed admin on startup ─────────────────────────────────────────────
  const prisma = new PrismaClient();

  // Run migrations on startup
  const { execSync } = await import('child_process');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    logger.log('✅ Database migrations applied');
  } catch (e) {
    logger.error('Migration failed', e);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@bhagwansingh.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@1234';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { email: adminEmail, passwordHash, fullName: 'Super Admin', role: 'SUPER_ADMIN', isActive: true },
    });
    logger.log('✅ Admin user created: ' + adminEmail);
  } else {
    logger.log('ℹ️ Admin already exists, skipping seed.');
  }
  await prisma.$disconnect();
  // ──────────────────────────────────────────────────────────────────────────

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
  logger.log(`📦 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});