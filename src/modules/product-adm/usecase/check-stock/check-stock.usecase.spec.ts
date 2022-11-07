import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUsecase from "./check-stock.usecase";


const product = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'Product Description',
    purchasePrice: 100,
    stock: 10
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product))
    }
}

describe("Check Stock usecase unit test", () => {
    it("should check a stock", async () => {
        // repository
        const productRepository = MockRepository();

        const checkStockUsecase = new CheckStockUsecase(productRepository);

        const input = {
            productId: '1'
        }
        const result = await checkStockUsecase.execute(input)
        expect(productRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe('1');
        expect(result.stock).toBe(10);
    });
});