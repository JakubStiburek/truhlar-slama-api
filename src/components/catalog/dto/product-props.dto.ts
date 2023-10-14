import { ApiProperty } from '@nestjs/swagger';

export class ProductPropsDto {
    @ApiProperty()
    readonly title: string;
    @ApiProperty()
    readonly description: string;
    @ApiProperty()
    readonly price: number;
    @ApiProperty()
    readonly amount: number;
    @ApiProperty()
    readonly code: string;

    constructor(title: string, description: string, price: number, amount: number, code: string) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.amount = amount;
        this.code = code;
    }
}
