// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users')// => /users
// export class UsersController {
//   constructor(private readonly usersService: UsersService) { }

//   @Post()// => /users
//   create(
//     // @Body("email") email: string,// == const myEmail = req.body.email //string
//     // @Body("password") password: string,
//     // @Body("name") name: string
//     @Body() createUserDto: CreateUserDto //tên biến: kiểu dữ liệu
//   ) {
//     return this.usersService.create(createUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.usersService.findAll();
//   }

//   @Get(':id')
//   findOne(
//     @Param('id')
//     id: string
//   ) { //= const id: string = req.params.id;
//     return this.usersService.findOne(id);
//   }

//   @Patch()
//   update(@Body() updateUserDto: UpdateUserDto) {
//     return this.usersService.update(updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.usersService.remove(id);
//   }


//   //  Tìm user theo tên hoặc email
//   @Post('search')
//   search(@Body('keyword') keyword: string) {
//     return this.usersService.search(keyword);
//   }
//   //  Lấy thông tin profile chi tiết
//   @Get(':id/profile')
//   getProfile(@Param('id') id: string) {
//     return this.usersService.getProfile(id);
//   }
// }


import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Users') // Gộp nhóm API trong Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Tạo người dùng mới
  @Post()
  @ApiOperation({ summary: 'Tạo mới người dùng' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Người dùng đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Lấy danh sách tất cả người dùng
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng được trả về thành công.' })
  findAll() {
    return this.usersService.findAll();
  }

  //  Lấy thông tin chi tiết theo ID
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Cập nhật thông tin người dùng
  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Người dùng đã được cập nhật thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cập nhật không hợp lệ.' })
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  //  Xóa người dùng theo ID
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người dùng cần xóa' })
  @ApiResponse({ status: 200, description: 'Người dùng đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  //  Tìm người dùng theo tên hoặc email
  @Post('search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo tên hoặc email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', example: 'john@example.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng phù hợp.' })
  search(@Body('keyword') keyword: string) {
    return this.usersService.search(keyword);
  }

  //  Lấy thông tin profile chi tiết của người dùng
  @Get(':id/profile')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết profile của người dùng' })
  @ApiParam({ name: 'id', description: 'ID người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin profile của người dùng.' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }
}
