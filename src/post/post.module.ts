import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads'
    }),
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
