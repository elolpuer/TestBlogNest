import { UserDto, PostDto } from './dto';
export declare class RenderPageDto {
    title: string;
    filenames?: object[];
    post?: PostDto;
    posts?: PostDto[];
    user?: UserDto;
    usersPost?: boolean;
    username?: string;
}
