import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto, CreateUserDto } from "../dto/dto";
import { Repository } from 'typeorm';
import { User } from 'src/entities/entities';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async payload(token: string): Promise<any> {
    return this.jwtService.decode(token)
  }

  async signin(user: SigninUserDto, res: Response): Promise<any> {
    const findedUser = await this.usersService.findOne(user.email);
    if (!findedUser) {
      return res.status(400).json({message: 'Wrong data'})
    }

    const isMatch = await bcrypt.compare(user.password, findedUser.password)

    if (!isMatch) {
      return res.status(400).json({message: 'Wrong data'})
    }

    const payload = { email: findedUser.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      username: findedUser.username,
      userID: findedUser.ID,
    };
  }

  async signup(user: CreateUserDto, res: Response) {
    const checkUser = 
      await this.userRepository.findOneBy({username: user?.username})
      || 
      await this.userRepository.findOneBy({email: user?.email})
    if (checkUser) {
        return res.status(400).json({message:'User with this username/email has been created'}) 
    }
    const hash = await bcrypt.hash(user.password, 13)

    const newUser = new User
        newUser.username = user.username
        newUser.email = user.email
        newUser.password = hash
    
    await this.userRepository.save(newUser);
  }
}