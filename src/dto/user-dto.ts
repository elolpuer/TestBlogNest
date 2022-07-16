import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({required:false})
    ID?: number;
    @ApiProperty({required:false})
    username?: string;
    @ApiProperty({required:false})
    email?: string;
}