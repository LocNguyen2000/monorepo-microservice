import { Injectable } from '@nestjs/common';
import { UserCreateDto, UserSignInDto } from '~/common/dto/user.dto';
import { UserService } from '~/user/user.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(user: UserSignInDto): Promise<any> {
    const profile = await this.userService.findOne({
      username: user.username,
    });
    if (profile && profile.password === user.password) {
      return user;
    }
    return null;
  }

  async register(user: UserCreateDto) {
    const SALT_ROUND = 12;
    const salt = await bcrypt.genSalt(SALT_ROUND);

    user.password = await bcrypt.hash(user.password, salt);
    console.log(user);

    return this.userService.create(user);
  }
}
