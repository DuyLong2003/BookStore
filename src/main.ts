import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));//js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views'));//view
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());



  // Cấu hình tài liệu OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription(`
      API quản lý người dùng của hệ thống.
      Bao gồm các endpoint:
      - Tạo người dùng
      - Lấy danh sách
      - Lấy chi tiết theo ID
      - Cập nhật
      - Xóa
      - Lọc theo địa chỉ
      - Đổi mật khẩu
      - Tìm kiếm theo tên
    `)
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
