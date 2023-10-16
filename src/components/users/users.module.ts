import { Module } from '@nestjs/common';
import { UsersService } from '@/components/users/users.service';
import { DbService } from '@/shared/postgres/db.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [DbService, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
