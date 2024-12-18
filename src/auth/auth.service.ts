import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/auth/user.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hashedPassword });
    return user.save();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  private generateRefreshToken(): string {
    return Math.random().toString(36).substring(2);
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { email: user.email, role: user.role };
    const refreshToken = this.generateRefreshToken();
    await this.userModel.updateOne(
      { email: user.email },
      { refreshToken: await bcrypt.hash(refreshToken, 10) },
    );
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async logout(email: string) {
    await this.userModel.updateOne({ email }, { refreshToken: null });
    return { message: 'User logged out successfully' };
  }

  async updateUserRole(userId: string, newRole: string, adminEmail: string): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.email === adminEmail) {
      throw new ForbiddenException('Admin cannot update their own role');
    }
    const allowedRoles = ['admin', 'editor', 'viewer'];
    if (!allowedRoles.includes(newRole)) {
      throw new ForbiddenException('Invalid role provided');
    }
    user.role = newRole;
    await user.save();
    return `Role updated to '${newRole}' for user ${user.email}`;
  }
}
