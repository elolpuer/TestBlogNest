/// <reference types="multer" />
import { Request, Response } from 'express';
import { RenderPageDto, PostDto } from 'src/dto/dto';
import { UsersService } from 'src/users/users.service';
import { PostService } from './post.service';
export declare class PostController {
    private readonly postService;
    private readonly usersService;
    constructor(postService: PostService, usersService: UsersService);
    addPage(req: Request): Promise<RenderPageDto>;
    add(files: Array<Express.Multer.File>, body: PostDto, req: Request, res: Response): Promise<void>;
    getAll(req: Request): Promise<RenderPageDto>;
    getOne(userID: number, ID: number, req: Request): Promise<RenderPageDto>;
    delete(ID: number, req: Request, res: Response): Promise<void>;
    updateGet(userID: number, ID: number, req: Request, res: Response): Promise<RenderPageDto>;
    update(files: Array<Express.Multer.File>, userID: number, ID: number, body: PostDto, res: Response, req: Request): Promise<void>;
}
