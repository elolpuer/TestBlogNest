import { Body, Controller, Get, Headers, Post, Render, Request, Req, Res, UseGuards } from '@nestjs/common';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from "../dto/create-user-dto"
import { LoginUserDto } from "../dto/login-user-dto"
import { Response, Request as RequestType } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('signin')
    @Render('signin')
    signinPage() : RenderPageDto {
        return { title: 'Sign In' }
    }

    @Post('signin')
    async signin(@Body() user: LoginUserDto, @Res() res: Response, @Req() req: RequestType) {
        const token = await this.authService.signin(user)
        res.cookie('token', token.access_token)
        res.cookie('email', user.email)
        res.cookie('username', token.username)
        res.cookie('id', token.userID)
        res.redirect("/post/all")
    }

    @Get('signup')
    @Render('signup')
    signupPage(): RenderPageDto {
        return { title: 'Sign Up' }
    }

    @Post('signup')
    async signup(@Body() newUser: CreateUserDto, @Res() res: Response, @Req() req: Request): Promise<any> {
       await this.authService.signup(
        newUser
       ).then(()=>{res.redirect("/auth/signin")})
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: RequestType, @Res() res: Response): Promise<any> {
        res.clearCookie('token')
        res.clearCookie('email')
        res.status(200).redirect('/post/all')
        
    }
}
