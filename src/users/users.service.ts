import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/entities';
import { Repository } from 'typeorm';
import { UserDto, SigninUserDto } from '../dto/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async findOne(email: string): Promise<SigninUserDto> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findOneByID(ID: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ID});
    return user;
  }

}