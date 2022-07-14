import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user-dto';
import { CreateUserDto } from 'src/dto/create-user-dto';
import { LoginUserDto } from "../dto/login-user-dto";
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async signin(user: LoginUserDto) {
    const findedUser = await this.usersService.findOne(user.email);
    const payload = { email: findedUser.email };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto) {
    const checkUser = 
      await this.userRepository.findOneBy({username: user?.username})
      || 
      await this.userRepository.findOneBy({email: user?.email})
    // if (user) {
    //     return res.status(400).json({message:'User with this username/email has been created'}) 
    // }
    const hash = await bcrypt.hash(user.password, 13)

    const newUser = new User
        newUser.username = user.username
        newUser.email = user.email
        newUser.password = hash
    
    await this.userRepository.save(newUser);
  }
}