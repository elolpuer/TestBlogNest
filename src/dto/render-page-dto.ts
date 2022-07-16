import { ApiProperty } from '@nestjs/swagger'
import { UserDto, PostDto} from './dto';

export class RenderPageDto {
    @ApiProperty({required: true})
    title: string;
    @ApiProperty({required: false})
    filenames?: object[];
    @ApiProperty({required: false, type: PostDto})
    post?: PostDto;
    @ApiProperty({required: false, type: Array<PostDto>})
    posts?: PostDto[];
    @ApiProperty({required: false, type: UserDto})
    user?: UserDto;
    @ApiProperty({required: false})
    usersPost?: boolean;
    @ApiProperty({required: false})
    username?: string;
}