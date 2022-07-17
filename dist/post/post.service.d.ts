/// <reference types="multer" />
import { Response } from 'express';
import { PostDto } from 'src/dto/dto';
import { Post } from 'src/entities/entities';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
export declare class PostService {
    private postRepository;
    private readonly userService;
    constructor(postRepository: Repository<Post>, userService: UsersService);
    add(userID: number, text: string, filenames: string): Promise<void>;
    getOne(ID: number): Promise<PostDto>;
    getAll(): Promise<Post[]>;
    addUsernameToPosts(posts: Post[]): Promise<PostDto[]>;
    delete(userID: number, ID: number, res: Response): Promise<void>;
    update(userID: number, ID: number, text: string, filesToDelete: string[], filesToAdd: Array<Express.Multer.File>, res: Response): Promise<void>;
    createFilenamesString(files: Array<Express.Multer.File>): Promise<string>;
    createJsonFilenames(filenames: string): Promise<any>;
}
