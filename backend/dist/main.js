"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "blob:", "https:"],
                connectSrc: ["'self'", ...allowedOrigins],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    app.enableCors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Prof. Bhagwan Singh — Portfolio API')
        .setDescription('RESTful API for the academic portfolio platform. ' +
        'Provides public content endpoints and authenticated admin CRUD operations.')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .addTag('auth', 'Authentication & Authorization')
        .addTag('content', 'Hero, About, Timeline, Courses, Achievements, Scholars, Announcements, Social Links')
        .addTag('publications', 'Journal Publications & Books')
        .addTag('gallery', 'Gallery Categories & Items')
        .addTag('submissions', 'Contact & Alumni Form Submissions')
        .addTag('media', 'File Upload & Management')
        .addTag('settings', 'Site Settings & SEO Metadata')
        .addTag('users', 'User Management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'method',
        },
    });
    logger.log('📚 Swagger docs available at /api/docs');
    app.enableShutdownHooks();
    const prisma = new client_1.PrismaClient();
    const { execSync } = await Promise.resolve().then(() => __importStar(require('child_process')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
    try {
        const backupScript = path.join(__dirname, '..', 'backup-db.js');
        try {
            execSync(`node "${backupScript}"`, { stdio: 'inherit' });
            logger.log('✅ Pre-migration database backup completed');
        }
        catch (e) {
            logger.warn('⚠️ Backup script failed or not found, continuing with migration', e);
        }
        logger.log('✅ Database startup phase complete');
    }
    catch (e) {
        logger.error('Startup script failed', e);
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
    }
    else {
        logger.log('ℹ️ Admin already exists, skipping seed.');
    }
    await prisma.$disconnect();
    const port = process.env.PORT ?? 4000;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Server running on http://0.0.0.0:${port}`);
    logger.log(`📦 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}
bootstrap().catch((err) => {
    console.error('Fatal error during bootstrap:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map