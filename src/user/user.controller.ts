import { Controller, Delete, Get } from '@nestjs/common';

@Controller('duylong')//duylong
//@Controller('user')//user
export class UserController {
    @Get()//GET == @Get("") == @Get("/") === /duylong/
    findAll(): string {
        return 'This action returns all users Duy Long';
    }
    @Get("/by-id")
    findById(): string {
        return 'This action will delete a user by id';
    }
}
