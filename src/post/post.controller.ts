import { Body, Controller, Get, Param, Post, Redirect, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Console } from 'console';
import { Response } from 'express';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { UsersService } from 'src/users/users.service';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ){}

    @Get('add')
    @Render('add')
    signinPage() : RenderPageDto {
        return { title: 'Add' }
    }

    @Post('add')
    @UseInterceptors(FilesInterceptor("files"))
    async add(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body, @Res() res: Response) {
        const filenames = await this.postService.createFilenamesString(files)
        await this.postService.add(1, body.text, filenames)
        res.status(200).redirect(`/post/all`)
    }

    @Get('/all')
    @Render('posts')
    async getAll(@Param('userID') params: number): Promise<RenderPageDto>  {
        const posts = await this.postService.getAll(params)
        return { title: "Posts", posts }
    }

    @Get('/user/:userID/:id')
    @Render('post')
    async getOne(@Param('userID') userID: number, @Param('id') ID: number): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        return {title: "Post", post}
    }

    @Post('/user/:userID/:id/delete')
    async delete(@Param('userID') userID: number, @Param('id') ID: number, @Res() res: Response) {
        await this.postService.delete(userID, ID)
        res.status(200).redirect(`/post/all`)
    }

    @Get('/user/:userID/:id/update')
    @Render('update')
    async updateGet(@Param('userID') userID: number, @Param('id') ID: number): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        return {title: "Update", post}
    }
    
    @Post('/user/:userID/:id/update')
    @UseInterceptors(FilesInterceptor("files"))
    async update(@UploadedFiles() files: Array<Express.Multer.File>, @Param('userID') userID: number, @Param('id') ID: number, @Body() body, @Res() res: Response) {
        let filesToDelete = []
        for (let i = 0; i < 10; i++) {
            if (body[i.toString()] !== undefined) {
                filesToDelete.push(body[i.toString()])
            }
        }
        await this.postService.update(
            ID,
            body.text,
            filesToDelete,
            files
        )
        res.status(200).redirect(`/post/user/${userID}/${ID}`)
    }

}
