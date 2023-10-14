import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateApiKeyService {
    constructor(private readonly configService: ConfigService) {}

    validate(key: string) {
        if (this.configService.get('NODE_ENV') === 'development') {
            return true;
        }

        const KEY = this.configService.get('API_KEY');
        return key === KEY;
    }
}
