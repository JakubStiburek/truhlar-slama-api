import { ApiProperty } from '@nestjs/swagger';

export class ProductCodeDto {
    @ApiProperty()
    readonly code: string;

    constructor(code: string) {
        this.code = code;
    }
}
