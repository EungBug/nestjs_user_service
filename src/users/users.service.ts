import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findByEmail (email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    create(data: CreateUserDto) {
        return this.prisma.user.create({data});    
    }
}
