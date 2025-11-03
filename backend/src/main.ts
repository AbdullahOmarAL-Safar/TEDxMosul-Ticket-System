import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // CORS: Allow frontend on port 3000 and 3001 to access backend on port 4000
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Enable validation globally
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    const port = parseInt(process.env.PORT || '4000', 10);
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend running on: http://localhost:${port}`);
    console.log(`📡 Server is listening on port ${port}`);
  } catch (error) {
    console.error('❌ Error starting backend:', error);
    process.exit(1);
  }
}
bootstrap().catch(err => {
  console.error('❌ Fatal error during bootstrap:', err);
  process.exit(1);
});
