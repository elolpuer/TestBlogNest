import { RenderPageDto } from 'src/dto/render-page-dto';
import { AuthService } from './auth.service';
import { SigninUserDto, CreateUserDto } from "../dto/dto";
import { Response, Request as RequestType } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signinPage(req: RequestType, res: Response): RenderPageDto;
    signin(user: SigninUserDto, req: RequestType, res: Response): Promise<void>;
    signupPage(req: RequestType, res: Response): RenderPageDto;
    signup(newUser: CreateUserDto, req: RequestType, res: Response): Promise<any>;
    logout(res: Response): Promise<any>;
}
