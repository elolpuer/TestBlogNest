import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { Express } from 'express'

@Controller('post')
export class PostController {

    @Get('add')
    @Render('add')
    signinPage() : RenderPageDto {
        return { title: 'Add' }
    }

    @Post('add')
    @UseInterceptors(FileInterceptor("file"))
    async addPost(@UploadedFile() file: Express.Multer.File, @Body() body) {
        console.log(body.text)
        console.log(file)
    }

}
