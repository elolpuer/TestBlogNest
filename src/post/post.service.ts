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
        if (post.filenames.length !== 0) {
            const filenames = await this.createJsonFilenames(post.filenames)
            return {ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames};
        } else {
            return {ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames: []};
        }
        
    }

    async getAll(userID: number): Promise<PostDto[]> {
        const posts = await this.postRepository.find()
        if (posts.length === 0) {
            return []
        } else {
            const postsToSend =
                posts.map((p) => {
                    return {
                        ID: p.ID,
                        userID: p.userID,
                        text: p.text,
                        date: p.date,
                        filenames: []
                    }
                })
            return postsToSend;
        }
    }

    async delete(userID: number, ID: number) {
        await this.postRepository.delete({ID, userID})
    }

    async update(ID: number, text: string, filesToDelete: string[], filesToAdd: Array<Express.Multer.File>) {
        const previousPost = await this.getOne(ID)
        //удаляем файлы
        previousPost.filenames = 
            previousPost.filenames
            .filter((v) => {
                for(let i = 0; i<filesToDelete.length;i++) {
                    if (v.filename == filesToDelete[i]){
                        return false
                    }
                }
                return true;
            })
            .map(v => {
                return {
                    filename: v.filename,
                    mimetype: v.mimetype
                }
            })
        //добавляем файлы
        filesToAdd.forEach(v => {
            previousPost.filenames.push(
                {
                    filename: v.filename,
                    mimetype: v.mimetype
                }
            )
        })
        //делаем строку
        const filenames = 
            previousPost.filenames
            .map((v) => {
                return JSON.stringify({"filename": v.filename, "mimetype": v.mimetype});
            })
            .toString()
        //обновляем
        await this.postRepository
            .createQueryBuilder()
            .update(Post)
            .set({
                text,
                filenames
            })
            .where("ID = :ID", {ID})
            .execute()
        
    }

    async createFilenamesString(files: Array<Express.Multer.File>): Promise<string> {
        const filenames = files.map((v) => {
            return JSON.stringify({"filename": v.filename, "mimetype": v.mimetype});
        })
        return filenames.toString()
    }

    async createJsonFilenames(filenames: string): Promise<any> {
        return filenames.split("},")
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
    }

}
