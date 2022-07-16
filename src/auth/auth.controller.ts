import { Body, Controller, Get, Headers, Post, Render, Request, Req, Res, UseGuards } from '@nestjs/common';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninUserDto, CreateUserDto } from "../dto/dto"
import { Response, Request as RequestType } from 'express';
import { ApiBody, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('signin')
    @Render('signin')
    @ApiResponse({ status: 200, type: RenderPageDto })
    signinPage() : RenderPageDto {
        return { title: 'Sign In' }
    }

    @ApiBody({ type: SigninUserDto })
    @Post('signin')
    @ApiResponse({ status: 200, type: RenderPageDto })
    @ApiResponse({ status: 400, description: 'Wrong data' })
    async signin(@Body() user: SigninUserDto, @Res() res: Response) {
        const token = await this.authService.signin(user, res)
        console.log(token.access_token)
        res.cookie('token', token.access_token)
        res.cookie('email', user.email)
        res.cookie('username', token.username)
        res.cookie('id', token.userID)
        res.redirect("/post/all")
    }

    @Get('signup')
    @Render('signup')
    @ApiResponse({ status: 200, type: RenderPageDto })
    signupPage(): RenderPageDto {
        return { title: 'Sign Up' }
    }

    @ApiBody({ type: CreateUserDto })
    @Post('signup')
    @ApiResponse({ status: 200, description: "User has been created", type: RenderPageDto})
    @ApiResponse({ status: 400, description: "User with this username/email has been created"})
    async signup(@Body() newUser: CreateUserDto, @Res() res: Response): Promise<any> {
       await this.authService.signup(
        newUser, res
       ).then(()=>{res.status(200).redirect("/auth/signin")})
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiResponse({ status: 200, description: "Logout", type: RenderPageDto})
    async logout(@Res() res: Response): Promise<any> {
        res.clearCookie('token')
        res.clearCookie('email')
        res.clearCookie('id')
        res.clearCookie('username')
        res.status(200).redirect('/post/all')
    }
}
