import { Bind, Controller, Logger, Post, Req, Request as NestRequest, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@/components/auth/local-auth.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginDto } from '@/components/auth/login.dto';
import { Request } from 'express';

@Controller()
export class AuthController {
    private readonly logger = new Logger('AuthController');

    @UseGuards(LocalAuthGuard)
    @Post('api/v1/auth/login')
    @Bind(NestRequest())
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ type: String })
    async login(
        @Req()
        req: Request & {
            user: { id: number; username: string };
            session: { user: { id: number; username: string } };
        },
    ): Promise<string> {
        req.session.user = { id: req.user.id, username: req.user.username };
        this.logger.log(`${req.user.username} logged in`);
        return 'Logged in';
    }

    @Post('api/v1/auth/logout')
    @ApiOkResponse({ type: String })
    async logout(
        @Req()
        req: Request & {
            session: { user: { id: number; username: string } };
        },
    ): Promise<string> {
        // const username = req.session.user.username;
        req.session.destroy((err) => {
            if (err) {
                this.logger.error(err);
            }
        });
        // this.logger.log(`${username} logged out`);
        return 'Logged out';
    }
}
