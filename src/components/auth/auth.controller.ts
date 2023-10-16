import { Bind, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@/components/auth/local-auth.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginDto } from '@/components/auth/login.dto';

@Controller()
export class AuthController {
    private readonly logger = new Logger('AuthController');

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    @Bind(Request())
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ type: String })
    async login(req: Request & { user: { username: string } }): Promise<string> {
        this.logger.log(`${req.user.username} logged in`);
        return 'Logged in';
    }
}
