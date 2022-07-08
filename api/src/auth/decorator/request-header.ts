import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Header = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx
      .switchToHttp()
      .getRequest().headers;

    const char = headers.char;

    // return header dto object
    return Number(char);
  },
);
