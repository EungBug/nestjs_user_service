import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/request/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private users: UsersService
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
}
