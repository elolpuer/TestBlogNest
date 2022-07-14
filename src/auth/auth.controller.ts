import { Body, Controller, Get, Post, Render, Req, Request, Res, UseGuards } from '@nestjs/common';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from "../dto/create-user-dto"
import { LoginUserDto } from "../dto/login-user-dto"
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('signin')
    @Render('signin')
    signinPage() : RenderPageDto {
        return { title: 'Sign In' }
    }

    @Post('signin')
    async signin(@Body() user: LoginUserDto, @Res() res: Response, @Req() req: Request) {
        console.log(await this.authService.signin(user))
        return await this.authService.signin(user);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
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
