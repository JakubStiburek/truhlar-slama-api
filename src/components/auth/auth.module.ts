import { Module } from '@nestjs/common';
import { UsersModule } from '@/components/users/users.module';
import { AuthService } from '@/components/auth/auth.service';
import { LocalStrategy } from '@/components/auth/local.strategy';
import { AuthController } from '@/components/auth/auth.controller';
import { LocalAuthGuard } from '@/components/auth/local-auth.guard';

@Module({
    imports: [UsersModule],
    providers: [AuthService, LocalStrategy, LocalAuthGuard],
    controllers: [AuthController],
})
export class AuthModule {}
