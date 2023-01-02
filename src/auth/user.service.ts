import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from 'src/domain/user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async findByFields(options: FindOneOptions): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  async findById(userId: number) {
    return await this.userRepository.findOne(userId);
  }

  async save(userDto: UserDto): Promise<UserDto | undefined> {
    await this.transformPassword(userDto);
    return await this.userRepository.save(userDto);
  }

  async transformPassword(user: UserDto): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
    return Promise.resolve();
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 올바르지않습니다');
    }
  }

  async validateUser(userDto: UserDto): Promise<User> {
    let userFind: User = await this.findByFields({
      where: { username: userDto.username },
    });
    if (!userFind) {
      throw new UnauthorizedException('아이디가 잘못되었습니다');
    }
    await this.verifyPassword(userDto.password, userFind.password);
    console.log('g');
    return userFind;
  }
}
