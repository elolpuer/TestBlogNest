import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { RenderPageDto } from './dto/render-page-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  index(@Res() res: Response) {
    res.redirect("/post/all")
  }
}
