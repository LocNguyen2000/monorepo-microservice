import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  UserCreateDto,
  UserQueryDto,
  UserSignInDto,
} from '~/common/dto/user.dto';
import { UserService } from '~/user/user.service';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthTokenDto } from '~/common/dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from '@nhl/schemas/auth';
import { Repository } from 'typeorm';
import { DbConnection } from '~/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@nhl/schemas/user';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(AuthToken, DbConnection.Auth)
    private readonly authRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}
  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('USER_CREATE');
  }

  async validateUser(user: UserSignInDto): Promise<any> {
    const profile = await this.userService.findOne({
      username: user.username,
    });

    const isSamePassword = this.checkHashPassword(
      user.password,
      profile.password,
    );
  }

  async register(user: UserCreateDto) {
    const response = await lastValueFrom(
      this.clientKafka.send('USER_CREATE', user),
    );
    const payload = plainToClass(UserCreateDto, response, {
      excludeExtraneousValues: true,
    });
    return this.createToken(payload);
  }

  private async createToken(payload: UserCreateDto): Promise<AuthTokenDto> {
    console.log('[PAYLOAD]', payload);

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    const token = this.authRepository.create({
      accessToken,
      refreshToken,
    });

    return this.authRepository.save(token);
  }

  private checkHashPassword(password: string, pwdInDb: string): boolean {
    return bcrypt.compareSync(password, pwdInDb);
  }
}
