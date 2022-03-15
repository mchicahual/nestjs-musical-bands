import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle("MusicalBand API")
    .setDescription("Musical Bands App")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/api/v1/docs", app, document, {
    swaggerOptions: {
      filter: true
    }
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Application listen on port ${process.env.PORT}`);
}
bootstrap();
