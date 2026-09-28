import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserRole } from './enum/user-role.enum.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @HttpCode(200)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto.page, paginationDto.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @HttpCode(200)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
