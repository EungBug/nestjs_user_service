import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtUser } from "src/auth/types/jwt-user";

export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtUser => {
      const req = ctx.switchToHttp().getRequest<Request & { user: JwtUser }>();
      return req.user;
    },
  );