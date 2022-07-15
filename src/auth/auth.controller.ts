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
        console.log(`Bearer ${token.access_token}`)
        res.cookie('token', token.access_token)
        res.redirect("/auth/profile")
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Headers("Authorization") token: string, @Request() req) {
        console.log(req.cookies)
        // console.log(req.headers)
        return req.user;
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
       ).then(()=>{res.redirect("/")})
    }
}
