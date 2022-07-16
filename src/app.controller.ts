import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { RenderPageDto } from './dto/render-page-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
}
