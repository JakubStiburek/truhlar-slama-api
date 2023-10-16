import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/components/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<{ username: string }> {
        const result = await this.authService.validateUser(username, password);
        if (result.isLeft()) {
            throw new UnauthorizedException();
        }

        return {
            username: result.unsafeCoerce().username,
        };
    }
}
