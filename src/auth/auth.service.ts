import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/request/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/request/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private users: UsersService,
        private jwt: JwtService
    ) {}


    async register(dto: RegisterDto) {
        const exists = await this.users.findByEmail(dto.email);

        if(exists) throw new BadRequestException("이미 가입한 유저입니다.");

        // 비밀번호 암호화
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.users.create({
            email: dto.email,
            password: hash,
            name: dto.name
        });

        return {id: user.id, email: user.email, name: user.name, createdAt: user.createdAt}
    }

    async login(dto: LoginDto) {
        const user = await this.users.findByEmail(dto.email);
        if(!user) throw new UnauthorizedException("아이디 또는 비밀번호가 일치하지 않습니다.");

        const verify = await bcrypt.compare(dto.password, user.password);
        if(!verify) throw new UnauthorizedException("아이디 또는 비밀번호가 일치하지 않습니다.");

        const payload = {sub: user.id, email: user.email, name: user.name};
        const accessToken = await this.jwt.signAsync(payload);
        return {id: user.id, accessToken: accessToken}
    }
}
