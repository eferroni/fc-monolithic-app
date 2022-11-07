import FindAllUsecase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUsecase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findUseCase: FindProductUsecase;
    findAllUseCase: FindAllUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private _findUseCase: FindProductUsecase;
    private _findAllUseCase: FindAllUsecase;
    
    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._findAllUseCase = props.findAllUseCase;
    }

    async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        const product = await this._findUseCase.execute(id);
        return product;
    }

    async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        const products = await this._findAllUseCase.execute();
        return products;
    }
}