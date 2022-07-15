import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // private readonly jwtService: JwtService,
  ) {}


  async findOne(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findOneByID(ID: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ID});
    return user;
  }

}