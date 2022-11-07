import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export default class CheckStockUsecase {
    private _productRepository: ProductGateway;

    constructor(repository: ProductGateway) {
        this._productRepository = repository;
    }

    async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {

        const product = await this._productRepository.find(input.productId);

        return {
            productId: product.id.id,
            stock: product.stock,
        }
    }
}