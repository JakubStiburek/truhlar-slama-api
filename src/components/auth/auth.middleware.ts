import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(
        @Req()
        req: Request & {
            user: { id: number; username: string };
            session: { user: { id: number; username: string } };
        },
        res: Response,
        next: NextFunction,
    ) {
        if (req.session.user) {
            next();
        } else {
            res.status(401).send({
                statusCode: 401,
                message: 'Unauthorized',
            });
        }
    }
}
