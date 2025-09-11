import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtUser } from "../types/jwt-user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(private users: UsersService) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET 환경 변수가 설정되어 있지 않습니다.');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET as string,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtUser> {
        return { id: payload.sub, email: payload.email, name: payload.name };
    }

}


export interface JwtPayload {
    sub: number;
    email: string;
    name: string;
}
