// import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';
// import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport';
// import { LocalAuthGuard } from './auth/local-auth.guard';

// @Controller()
// export class AppController {
//   constructor(
//     private readonly appService: AppService,
//     private configService: ConfigService
//   ) { }

//   @UseGuards(LocalAuthGuard)
//   @Post('/login')
//   handleLogin(@Request() req) {
//     return req.user;
//   }
// }


import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) { }

  //  Endpoint kiểm tra tình trạng hệ thống
  @Public()
  @Get('healthz')
  @ApiOperation({ summary: 'Kiểm tra trạng thái hệ thống (health check)' })
  @ApiResponse({ status: 200, description: 'Trạng thái hệ thống hiện tại' })
  getHealth() {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const version = process.env.npm_package_version || '1.0.0';
    const port = this.configService.get<string>('PORT');

    return {
      status: 'ok',
      uptime,
      version,
      port,
      timestamp,
    };
  }

  //  Endpoint đăng nhập
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống (Local strategy)' })
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công, trả về user' })
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  //@UseGuards(JwtAuthGuard)
  @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
