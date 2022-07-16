import { ApiProperty } from '@nestjs/swagger'
export class PostDto {
    @ApiProperty({required: false})
    ID?: number;
    @ApiProperty({required: false})
    userID?: number;
    @ApiProperty({required: false})
    username?: string;
    @ApiProperty({required: true})
    text: string;
    @ApiProperty({required: false})
    date?: Date;
    @ApiProperty({required: false})
    filenames?: any[];
}