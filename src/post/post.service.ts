import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddPostDto } from 'src/dto/add-post-dto';
import { PostDto } from 'src/dto/post-dto';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>
      ) {}

    async add(userID: number, text: string, filenames: string) {
        const newPost = new Post
            newPost.userID = userID
            newPost.text = text
            newPost.date = new Date
            newPost.filenames = filenames

        await this.postRepository.save(newPost)
    }

    async getOne(ID: number): Promise<Post> {
        return await this.postRepository.findOneBy({ID})
    }

    async createFilenamesString(files: Array<Express.Multer.File>): Promise<string> {
        const filenames = files.map((v) => {
            return v.filename;
        })
        return filenames.toString()
    }

}
