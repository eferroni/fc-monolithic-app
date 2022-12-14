import { Sequelize } from "sequelize-typescript"
import ProductAdmFacadeFactory from "../factory/facade.factory";
import ProductCatalogModel from "../../store-catalog/repository/product.model";
import { ProductModel } from "../repository/product.model";

describe("Product Adm Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([ProductModel, ProductCatalogModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {        
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Product Description',
            purchasePrice: 100,
            stock: 10
        }

        await productFacade.addProduct(input);

        const product = await ProductModel.findOne({where: {id: '1'}});
        expect(product).toBeDefined();
        expect(product.id).toBe(input.id);
        expect(product.name).toBe(input.name);
        expect(product.description).toBe(input.description);
        expect(product.purchasePrice).toBe(input.purchasePrice);
        expect(product.stock).toBe(input.stock);
    });

    it("should check the stock", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const inputAddProduct = {
            id: '1',
            name: 'Product 1',
            description: 'Product Description',
            purchasePrice: 100,
            stock: 10
        }

        await productFacade.addProduct(inputAddProduct);

        const inputCheckStock = {
            productId: '1'
        };

        const result = await productFacade.checkStock(inputCheckStock);
        expect(result.productId).toBe(inputAddProduct.id);
        expect(result.stock).toBe(inputAddProduct.stock);
    })
});