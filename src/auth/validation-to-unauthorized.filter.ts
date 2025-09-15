import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationToUnauthorizedFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const body = exception.getResponse();

    return res.status(401).json({
      code: 'INVALID_LOGIN',
      message: '이메일 또는 비밀번호가 유효하지 않습니다.',
      details: (body as any)?.message ?? body,
    });
  }
}
