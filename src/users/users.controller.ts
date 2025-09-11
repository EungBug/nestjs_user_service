import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { JwtUser } from 'src/auth/types/jwt-user';
import { GetUser } from 'src/common/decorators/get-user.decorator';

type RequestWithUser = Request & { user: JwtUser };

@Controller('users')
export class UsersController {
    
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@GetUser() req: RequestWithUser) {
        return req.user;
    }
}
