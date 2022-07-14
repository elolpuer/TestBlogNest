import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.setViewEngine('hbs')
  app.set('view options', { layout: '/layouts/main' });
  hbs.registerPartials(join(__dirname, "../", "/views/partials"));
  
  await app.listen(3000);
}
bootstrap();
