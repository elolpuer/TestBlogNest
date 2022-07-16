import { ApiProperty } from "@nestjs/swagger";

export class SigninUserDto{
    @ApiProperty({required: false})
    ID?: number;
    @ApiProperty({required: true})
    email: string;
    @ApiProperty({required: true})
    username?: string;
    @ApiProperty({required: true})
    password: string;
}