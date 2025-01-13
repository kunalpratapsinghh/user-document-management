import { Body, Controller, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RolesGuard } from '../rolePermission/roles.guard';
import { Roles } from '../rolePermission/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) 
  async logout(@Req() req) {
    const email = req.user.email;
    return await this.authService.logout(email);
  }

  @Put('update-role/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: { role: string },
    @Req() req
  ) {
    const adminEmail = req.user.email;
    return await this.authService.updateUserRole(userId, updateRoleDto.role, adminEmail);
  }
}
