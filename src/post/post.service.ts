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

    async getOne(ID: number): Promise<PostDto> {
        const post = await this.postRepository.findOneBy({ID})
        const filenames = 
            post.filenames.split("},")
            .map((v, i, arr) => {
                if (i != arr.length - 1) {
                    v = v.concat("}")
                }
                return JSON.parse(v)
            })
            .map((v) => {
                if (v.mimetype.includes("video")) {
                    v.video = true
                } else {
                    v.video = false
                }
                return v;
            })
        return {ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames};
    }


    async createFilenamesString(files: Array<Express.Multer.File>): Promise<string> {
        const filenames = files.map((v) => {
            return JSON.stringify({"filename": v.filename, "mimetype": v.mimetype});
        })
        return filenames.toString()
    }

}
