import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { AppModule } from './app.module.js';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { StructuredLogger } from './common/logger/logger.service.js';

async function bootstrap() {
  const logger = new StructuredLogger();
  const app = await NestFactory.create(AppModule, { logger });

  // 0. Observability: Correlation IDs & Global Exception Filtering
  const correlationMiddleware = new CorrelationIdMiddleware();
  app.use((req: any, res: any, next: any) => correlationMiddleware.use(req, res, next));
  app.useGlobalFilters(new HttpExceptionFilter());

  // 1. Helmet: Essential HTTP Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Let Next.js frontend manage CSP for web clients
    }),
  );

  // 2. Rate Limiting: 60 requests per minute per IP to prevent DoS & brute force
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 60,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 60 seconds.',
      },
    }),
  );

  // 3. Strict Input Validation & Sanitization against Injection / Prototype Pollution
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Secure CORS: Environment-driven origins with safe defaults
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (curl/Postman/healthcheck) or allowed domains in production
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`✨ Nest.js Luxury Real Estate API is running on http://localhost:${port}`);
}

await bootstrap();
