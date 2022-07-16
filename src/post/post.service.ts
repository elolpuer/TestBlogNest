import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { PostDto } from 'src/dto/dto';
import { Post } from 'src/entities/entities';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        private readonly userService: UsersService
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
            //делаем json файлы
            const filenames = await this.createJsonFilenames(post.filenames)
            return {ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames};
        } else {
            return {ID: post.ID, userID: post.userID, text: post.text, date: post.date, filenames: []};
        }
        
    }

    async getAll(): Promise<Post[]> {
        const posts = 
            await this.postRepository
            .createQueryBuilder()
            .getMany()
        if (posts.length === 0) {
            return []
        } else {
            return posts;
        }
    }

    //посты приходят без username, а нам надо их добавлять, не хотел использовать join
    async addUsernameToPosts(posts: Post[]):Promise<PostDto[]> {
        let postsToSend:PostDto[] = []
        for (let i = 0; i < posts.length; i++) {
            const user = await this.userService.findOneByID(posts[i].userID)
            let post: PostDto = {
                ID: posts[i].ID,
                userID: posts[i].userID,
                username: user.username,
                text: posts[i].text,
                date: posts[i].date,
                filenames: [],
            }
            postsToSend[i] = post
        }
        return postsToSend;
    }

    async delete(userID: number, ID: number, res: Response) {
        const post = await this.postRepository.findOneBy({ID})
        if (post.userID != userID) {
            res.status(400).json({message: "You are not post owner"})
        } else {
            await this.postRepository.delete({ID, userID})
        }
    }

    async update(
        userID: number, 
        ID: number, 
        text: string, 
        filesToDelete: string[], 
        filesToAdd: Array<Express.Multer.File>,
        res: Response
    ) {
        //берем наш старый пост
        const previousPost = await this.getOne(ID)
        if (previousPost.userID != userID) {
            res.status(400).json({message: "You are not post owner"})
        }
        else {
            //удаляем файлы
        previousPost.filenames = 
        previousPost.filenames
        //фильтрыем по принципу есть ли название файла в файлах для удаления
        .filter((v) => {
            for(let i = 0; i<filesToDelete.length;i++) {
                if (v.filename == filesToDelete[i]){
                    return false
                }
            }
            return true;
        })
        //делаем обьект
        .map(v => {
            return {
                filename: v.filename,
                mimetype: v.mimetype
            }
        })
    //добавляем новые файлы, если есть
    filesToAdd.forEach(v => {
        previousPost.filenames.push(
            {
                filename: v.filename,
                mimetype: v.mimetype
            }
        )
    })
    //делаем строку из файлов
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
        .where("userID = :userID", {userID})
        .where("ID = :ID", {ID})
        .execute()
        }
        
        
    }

    //делаем строку из файлов
    //оставляем лишь название и тип
    async createFilenamesString(files: Array<Express.Multer.File>): Promise<string> {
        const filenames = files.map((v) => {
            return JSON.stringify({"filename": v.filename, "mimetype": v.mimetype});
        })
        return filenames.toString()
    }

    //делаем json из строки файлов
    //вставляем название и тип
    async createJsonFilenames(filenames: string): Promise<any> {
        return filenames.split("},")
                .map((v, i, arr) => {
                    //если не последний то обрезаем по закрытию скобки
                    if (i != arr.length - 1) {
                        v = v.concat("}")
                    }
                    return JSON.parse(v)
                })
                //если тип == видео тогда добавляем это в json
                //необходимо для просмотра на страницы
                //разделять картинки и видео в разные теги
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
