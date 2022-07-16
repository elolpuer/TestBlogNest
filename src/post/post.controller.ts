import { Body, Controller, Get, Param, Post, Redirect, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Console } from 'console';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostDto } from 'src/dto/post-dto';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { UserDto } from 'src/dto/user-dto';
import { UsersService } from 'src/users/users.service';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('add')
    @Render('add')
    async signinPage(@Req() req: Request) : Promise<RenderPageDto> {
        return { 
            title: 'Add', 
            user: {username: req.cookies.username}
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    @UseInterceptors(FilesInterceptor("files"))
    async add(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: PostDto, @Req() req: Request, @Res() res: Response) {
        const filenames = await this.postService.createFilenamesString(files)
        await this.postService.add(req.cookies.id, body.text, filenames)
        res.status(200).redirect(`/post/all`)
    }

    @Get('/all')
    @Render('posts')
    async getAll(@Param('userID') params: number, @Req() req: Request): Promise<RenderPageDto>  {
        const posts = await this.postService.getAll(params)
        return { 
            title: "Posts", 
            posts, 
            user: req.cookies.username === undefined ? null : {username: req.cookies.username}
        }
    }

    @Get('/user/:userID/:id')
    @Render('post')
    async getOne(@Param('userID') userID: number, @Param('id') ID: number, @Req() req: Request): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        let user: UserDto;
        let usersPost: boolean;
        if (req.cookies.email !== undefined) {
            const _user = await this.usersService.findOne(req.cookies.email)
            usersPost = userID == _user.ID
            user = {username: req.cookies.username}
        } else {
            user = null
            usersPost = false
        }
        return {
            title: "Post", 
            post, 
            user,
            usersPost
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/user/:userID/:id/delete')
    async delete(@Param('userID') userID: number, @Param('id') ID: number, @Res() res: Response) {
        await this.postService.delete(userID, ID)
        res.status(200).redirect(`/post/all`)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/:userID/:id/update')
    @Render('update')
    async updateGet(@Param('userID') userID: number, @Param('id') ID: number, @Req() req: Request): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        return {title: "Update", post, user: {username: req.cookies.username}}
    }
    
    @UseGuards(JwtAuthGuard)
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
