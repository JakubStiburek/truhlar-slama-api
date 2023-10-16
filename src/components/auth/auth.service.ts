import { Injectable } from '@nestjs/common';
import { UsersService } from '@/components/users/users.service';
import { Either } from 'purify-ts';
import { User } from '@/components/users/user.entity';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, password: string): Promise<Either<Error, User>> {
        return this.usersService.getUser(username, password);
    }
}
