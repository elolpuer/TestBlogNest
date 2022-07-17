import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto, CreateUserDto } from "../dto/dto";
import { Repository } from 'typeorm';
import { User } from 'src/entities/entities';
import { Response } from 'express';
export declare class AuthService {
    private userRepository;
    private readonly usersService;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, usersService: UsersService, jwtService: JwtService);
    payload(token: string): Promise<any>;
    signin(user: SigninUserDto, res: Response): Promise<any>;
    signup(user: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
