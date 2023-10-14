export class ProductProps {
    constructor(
        readonly title: string,
        readonly description: string,
        readonly price: number,
        readonly amount: number,
        readonly code: string,
    ) {}
}
