import { Bind, Controller, Logger, Post, Req, Request as NestRequest, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@/components/auth/local-auth.guard';
import { ApiBody, ApiNoContentResponse } from '@nestjs/swagger';
import { LoginDto } from '@/components/auth/login.dto';
import { Request } from 'express';

@Controller()
export class AuthController {
    private readonly logger = new Logger('AuthController');

    @UseGuards(LocalAuthGuard)
    @Post('api/v1/auth/login')
    @Bind(NestRequest())
    @ApiBody({ type: LoginDto })
    @ApiNoContentResponse()
    async login(
        @Req()
        req: Request & {
            user: { id: number; username: string };
            session: { user: { id: number; username: string } };
        },
    ): Promise<void> {
        req.session.user = { id: req.user.id, username: req.user.username };
        this.logger.log(`${req.user.username} logged in`);
    }

    @Post('api/v1/auth/logout')
    @ApiNoContentResponse()
    async logout(
        @Req()
        req: Request & {
            session: { user: { id: number; username: string } };
        },
    ): Promise<void> {
        req.session.destroy((err) => {
            if (err) {
                this.logger.error(err);
            }
        });
    }
}
