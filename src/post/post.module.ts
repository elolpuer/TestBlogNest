import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
    TypeOrmModule.forFeature([Post])
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
