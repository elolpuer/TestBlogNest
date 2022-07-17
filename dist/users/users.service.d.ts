import { User } from 'src/entities/entities';
import { Repository } from 'typeorm';
import { UserDto, SigninUserDto } from '../dto/dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findOne(email: string): Promise<SigninUserDto>;
    findOneByID(ID: number): Promise<UserDto>;
}
