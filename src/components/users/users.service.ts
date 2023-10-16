import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '@/shared/postgres/db.service';
import { Either, Left, Right } from 'purify-ts';
import { User } from '@/components/users/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DbService)
        private db: DbService,
    ) {}

    async getUser(username: string, password: string): Promise<Either<Error, User>> {
        try {
            const result = await this.db.sql<{ id: number; username: string }[]>`
                SELECT id, username
                FROM administration_user
                WHERE username = ${username}
                  AND password_hash = crypt(${password}, password_hash);`;

            if (!result) {
                return Left(new Error('Error getting user'));
            }

            return Right(new User(result[0].id, result[0].username));
        } catch (e) {
            return Left(new Error('Error getting user'));
        }
    }
}
