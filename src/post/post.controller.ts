import { Body, Controller, Get, Param, Post, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RenderPageDto, PostDto, UserDto } from 'src/dto/dto';
import { UsersService } from 'src/users/users.service';
import { PostService } from './post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly usersService: UsersService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('add')
    @Render('add')
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    @ApiResponse({ status: 401, description: "Unauthorized"})
    async addPage(@Req() req: Request) : Promise<RenderPageDto> {
        return { 
            title: 'Add', 
            user: {username: req.cookies.username}
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    @UseInterceptors(FilesInterceptor("files"))
    @ApiBody({type: PostDto})
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    @ApiResponse({ status: 401, description: "Unauthorized"})
    async add(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: PostDto, @Req() req: Request, @Res() res: Response) {
        //из полученых файлов делаем строку
        const filenames = await this.postService.createFilenamesString(files)
        await this.postService.add(req.cookies.id, body.text, filenames)
        res.status(200).redirect(`/post/all`)
    }

    @Get('/all')
    @Render('posts')
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    async getAll(@Req() req: Request): Promise<RenderPageDto>  {
        const posts = await this.postService.getAll()
        const postsWithUsername = await this.postService.addUsernameToPosts(posts)
        return { 
            title: "Posts",
            posts: postsWithUsername, 
            user: req.cookies.username === undefined ? null : {username: req.cookies.username}
        }
    }

    @Get('/user/:userID/:id')
    @Render('post')
    @ApiParam({name: 'userID', type: Number})
    @ApiParam({name: 'id', type: Number})
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    async getOne(@Param('userID') userID: number, @Param('id') ID: number, @Req() req: Request): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        const username = (await this.usersService.findOneByID(userID)).username
        let user: UserDto;
        let usersPost: boolean;
        //для рендера страницы чекаем есть ли юзер
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
            usersPost,
            username
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/user/:userID/:id/delete')
    @ApiParam({name: 'userID', type: Number})
    @ApiParam({name: 'id', type: Number})
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    @ApiResponse({ status: 400, description: "You are not post owner"})
    @ApiResponse({ status: 401, description: "Unauthorized"})
    async delete(@Param('id') ID: number, @Req() req: Request,@Res() res: Response) {
        await this.postService.delete(req.cookies.id, ID, res)
        res.status(200).redirect(`/post/all`)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user/:userID/:id/update')
    @Render('update')
    @ApiParam({name: 'userID', type: Number})
    @ApiParam({name: 'id', type: Number})
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    @ApiResponse({ status: 400, description: "Your not post owner"})
    @ApiResponse({ status: 401, description: "Unauthorized"})
    async updateGet(@Param('userID') userID: number, @Param('id') ID: number, @Req() req: Request,@Res() res: Response): Promise<RenderPageDto> {
        const post = await this.postService.getOne(ID)
        if (post.userID != req.cookies.id) {
            res.status(400).json({message: "You are not post owner"})
        } else {
            return {title: "Update", post, user: {username: req.cookies.username}}
        }
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('/user/:userID/:id/update')
    @UseInterceptors(FilesInterceptor("files"))
    @ApiParam({name: 'userID', type: Number})
    @ApiParam({name: 'id', type: Number})
    @ApiBody({type: PostDto})
    @ApiResponse({ status: 200, description: "Page", type: RenderPageDto})
    @ApiResponse({ status: 400, description: "You are not post owner"})
    @ApiResponse({ status: 401, description: "Unauthorized"})
    async update(
        @UploadedFiles() files: Array<Express.Multer.File>, 
        @Param('userID') userID: number, 
        @Param('id') ID: number, 
        @Body() body: PostDto, 
        @Res() res: Response,
        @Req() req: Request
    ) {
        let filesToDelete = []
        //собираем из body файлы для удаления
        for (let i = 0; i < 10; i++) {
            if (body[i.toString()] !== undefined) {
                filesToDelete.push(body[i.toString()])
            }
        }
        await this.postService.update(
            req.cookies.id,
            ID,
            body.text,
            filesToDelete,
            files,
            res
        )
        res.status(200).redirect(`/post/user/${userID}/${ID}`)
    }

}
