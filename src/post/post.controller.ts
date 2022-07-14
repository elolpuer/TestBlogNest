import { Body, Controller, Get, Param, Post, Render, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Get('add')
    @Render('add')
    signinPage() : RenderPageDto {
        return { title: 'Add' }
    }

    @Post('add')
    @UseInterceptors(FilesInterceptor("files"))
    async addPost(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
        const filenames = await this.postService.createFilenamesString(files)
        await this.postService.add(1, body.text, filenames)
        console.log("Ok")
    }

    @Get(':id')
    @Render('post')
    async getPost(@Param('id') params: number): Promise<RenderPageDto> {
        const post = await this.postService.getOne(params)
        const filenames = post.filenames.split(",").map((v) => {return {hash: v}})
        return {title: "Post", text: post.text, date: post.date, filenames}
    }

}
