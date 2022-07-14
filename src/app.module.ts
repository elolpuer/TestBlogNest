import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DBConnectionService } from './db-connection.service';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DBConnectionService,
    }),
    TypeOrmModule.forFeature([ User ]),
    MulterModule.register({
      dest: './uploads'
    }),
    AuthModule, 
    UsersModule, PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
