import { comparePasswordHelper } from '@/helpers/util';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  changePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!user || !isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role };
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  checkCode = async (codeDto: CodeAuthDto) => {
    return await this.usersService.handleActive(codeDto);
  };

  retryActive = async (email: string) => {
    return await this.usersService.retryActive(email);
  };

  retryPassword = async (email: string) => {
    return await this.usersService.retryPassword(email);
  };

  changePassword = async (data: changePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  };
}
