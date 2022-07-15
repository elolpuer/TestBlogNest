import { UserDto } from "./user-dto";
import { PostDto } from "./post-dto";
import { CommentDto } from "./comment-dto";

export interface RenderPageDto {
    title: string;
    text?: string;
    date?: Date;
    filenames?: object[];
    post?: PostDto;
    posts?: PostDto[];
    user?: UserDto;
    users?: UserDto[];
    username?: string;
    allPosts?: boolean;
    comments?: CommentDto[]
}