import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import { join } from 'path';
import * as express from 'express'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Blog Testwork Nest.js')
    .setDescription('Allows to add/see/update/delete posts with files')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setViewEngine('hbs')
  app.set('view options', { layout: '/layouts/main' });
  hbs.registerPartials(join(__dirname, "../", "/views/partials"));
  app.use(express.static("uploads"));
  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(5000);
}
bootstrap();
