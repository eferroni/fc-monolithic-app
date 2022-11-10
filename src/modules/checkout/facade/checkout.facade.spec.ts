import { Sequelize } from "sequelize-typescript"
import ClientModel from "../../client-adm/repository/client.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import ProductCatalogModel from "../../store-catalog/repository/product.model";
import CheckoutFacadeFactory from "../factory/facade.factory";
import OrderItemModel from "../repository/order-item.model";
import OrderModel from "../repository/order.model";

describe("Checkout Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([
            ClientModel,
            ProductAdmModel, ProductCatalogModel,
            OrderModel, OrderItemModel,
            TransactionModel,
            InvoiceModel, InvoiceItemModel
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an order", async () => { 
        await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@email.com',
            document: '',
            street: 'Street 1',
            number: 'Number 1',
            complement: 'Complement 1',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductAdmModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 Description',
            purchasePrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductCatalogModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 Description',
            salesPrice: 100,
        });

        await ProductAdmModel.create({
            id: '2',
            name: 'Product 2',
            description: 'Product 2 Description',
            purchasePrice: 200,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductCatalogModel.create({
            id: '2',
            name: 'Product 2',
            description: 'Product 2 Description',
            salesPrice: 200,
        });

        const facade = CheckoutFacadeFactory.create()

        const input = {
            clientId: '1',
            products: [{productId: '1'}, {productId: '2'}]
        };

        await facade.placeOrder(input);

        const order_id = await OrderModel.findOne();
        const order = await OrderModel.findOne({
            where: {id: order_id.id},
            include: ['products', 'client']
        });

        expect(order).toBeDefined();
        expect(order.id).toBeDefined();
        expect(order.status).toBe('approved');

        expect(order.client.id).toBe('1');
        expect(order.client.name).toBe('Client 1');
        expect(order.client.email).toBe('client@email.com');
        expect(order.client.street).toBe('Street 1');
        expect(order.client.number).toBe('Number 1');
        expect(order.client.complement).toBe('Complement 1');
        expect(order.client.city).toBe('City 1');
        expect(order.client.state).toBe('State 1');
        expect(order.client.zipCode).toBe('Zip 1');

        expect(order.products).toHaveLength(2);
        expect(order.products[0].id).toBe('1');
        expect(order.products[0].name).toBe('Product 1');
        expect(order.products[0].description).toBe('Product 1 Description');
        expect(order.products[0].salesPrice).toBe(100);
        expect(order.products[1].id).toBe('2');
        expect(order.products[1].name).toBe('Product 2');
        expect(order.products[1].description).toBe('Product 2 Description');
        expect(order.products[1].salesPrice).toBe(200);
    });
});