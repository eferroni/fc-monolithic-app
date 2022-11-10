import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import ClientModel from "../../client-adm/repository/client.model";
import ClientRepository from "../../client-adm/repository/client.repository";

describe("Order Repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([OrderModel, OrderItemModel, ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    
    it("should create an order", async () => {
        const clientProps = {
            id: new Id('1'),
            name: 'Client 1',
            email: 'client@email.com',
            street: 'Street 1',
            number: 'Number 1',
            complement: 'Complement 1',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1'
        };

        await ClientModel.create({
            id: clientProps.id.id,
            name: clientProps.name,
            email: clientProps.email,
            document: '',
            street: clientProps.street,
            number: clientProps.number,
            complement: clientProps.complement,
            city: clientProps.city,
            state: clientProps.state,
            zipCode: clientProps.zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const client = new Client(clientProps);

        const repository = new OrderRepository();
        
        const product1 = new Product({
            id: new Id('1'),
            name: 'Product 1',
            description: 'Product 1 Description',
            salesPrice: 100
        });

        const product2 = new Product({
            id: new Id('2'),
            name: 'Product 2',
            description: 'Product 2 Description',
            salesPrice: 200
        });

        const props = {
            id: new Id('1'),
            client: client,
            products: [product1, product2],
        }
        
        const order = new Order(props);
        await repository.addOrder(order);

        const orderDb = await OrderModel.findOne({
            where: {id: props.id.id},
            include: ['products', 'client']
        });

        expect(orderDb.id).toEqual(props.id.id);
        expect(orderDb.status).toEqual('pending');

        expect(orderDb.client.id).toEqual(props.client.id.id);
        expect(orderDb.client.name).toEqual(props.client.name);
        expect(orderDb.client.street).toEqual(props.client.street);
        expect(orderDb.client.number).toEqual(props.client.number);
        expect(orderDb.client.complement).toEqual(props.client.complement);
        expect(orderDb.client.zipCode).toEqual(props.client.zipCode);
        expect(orderDb.client.city).toEqual(props.client.city);
        expect(orderDb.client.state).toEqual(props.client.state);
        
        expect(orderDb.products.length).toEqual(2);
        expect(orderDb.products[0].id).toEqual(product1.id.id);
        expect(orderDb.products[0].name).toEqual(product1.name);
        expect(orderDb.products[0].salesPrice).toEqual(product1.salesPrice);
        expect(orderDb.products[1].id).toEqual(product2.id.id);
        expect(orderDb.products[1].name).toEqual(product2.name);
        expect(orderDb.products[1].salesPrice).toEqual(product2.salesPrice);
        
    });

    it("should find an order", async () => {
        const repository = new OrderRepository();

        await OrderModel.create({
            id: '1',
            status: 'pending',
            client: {
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
            },
            products: [
                {
                    id: '1',
                    name: 'Product 1',
                    description: 'Product 1 Description',
                    salesPrice: 100
                },
                {
                    id: '2',
                    name: 'Product 2',
                    description: 'Product 2 Description',
                    salesPrice: 200
                }
            ]
        },
        {include: [{model: OrderItemModel}, {model: ClientModel}]})    
        
        const order = await repository.findOrder('1');

        expect(order.id.id).toEqual('1');
        expect(order.status).toEqual('pending');

        expect(order.client.name).toEqual('Client 1');
        expect(order.client.email).toEqual('client@email.com');
        expect(order.client.document).toEqual('');
        expect(order.client.street).toEqual('Street 1');
        expect(order.client.number).toEqual('Number 1');
        expect(order.client.complement).toEqual('Complement 1');
        expect(order.client.zipCode).toEqual('Zip 1');
        expect(order.client.city).toEqual('City 1');
        expect(order.client.state).toEqual('State 1');
        expect(order.client.createdAt).toBeDefined()
        expect(order.client.updatedAt).toBeDefined();

        expect(order.products).toHaveLength(2);
        expect(order.products[0].id.id).toEqual('1');
        expect(order.products[0].name).toEqual('Product 1');
        expect(order.products[0].description).toEqual('Product 1 Description');
        expect(order.products[0].salesPrice).toEqual(100);
        expect(order.products[1].id.id).toEqual('2');
        expect(order.products[1].name).toEqual('Product 2');
        expect(order.products[1].description).toEqual('Product 2 Description');
        expect(order.products[1].salesPrice).toEqual(200);
    });
})