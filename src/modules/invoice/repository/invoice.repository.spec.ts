import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import Address from "../../@shared/domain/value-object/address";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItemModel from "./invoice-item.model";

describe("Product Repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an invoice", async () => {
        const repository = new InvoiceRepository();

        const address = new Address(
            'street 1',
            'number 1',
            'complement 1',
            'zip 1',
            'city 1',
            'state 1'
        )
        
        const product1 = new Product({id: new Id('1'), name: 'Product 1', price: 100});
        const product2 = new Product({id: new Id('2'), name: 'Product 2', price: 200});

        const props = {
            id: new Id('1'),
            name: 'Invoice 1',
            document: 'Doc 1234',
            address: address,
            items: [product1, product2],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        
        const invoice = new Invoice(props);
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: {id: props.id.id},
            include: ['items']
        });

        expect(invoiceDb.id).toEqual(props.id.id);
        expect(invoiceDb.name).toEqual(props.name);
        expect(invoiceDb.document).toEqual(props.document);

        expect(invoiceDb.street).toEqual(props.address.street);
        expect(invoiceDb.number).toEqual(props.address.number);
        expect(invoiceDb.complement).toEqual(props.address.complement);
        expect(invoiceDb.zipCode).toEqual(props.address.zipCode);
        expect(invoiceDb.city).toEqual(props.address.city);
        expect(invoiceDb.state).toEqual(props.address.state);
        
        expect(invoiceDb.items.length).toEqual(2);
        expect(invoiceDb.items[0].id).toEqual(product1.id.id);
        expect(invoiceDb.items[0].name).toEqual(product1.name);
        expect(invoiceDb.items[0].price).toEqual(product1.price);
        expect(invoiceDb.items[1].id).toEqual(product2.id.id);
        expect(invoiceDb.items[1].name).toEqual(product2.name);
        expect(invoiceDb.items[1].price).toEqual(product2.price);
        
        expect(invoiceDb.total).toEqual(300);
    });

    it("should find an invoice", async () => {
        const repository = new InvoiceRepository();

        await InvoiceModel.create({
            id: '1',
            name: 'Invoice 1',
            document: 'Doc 1234',
            street: 'street 1',
            number: 'number 1',
            complement: 'complement 1',
            city: 'city 1',
            state: 'state 1',
            zipCode: 'zip 1',
            createdAt: new Date(),
            updatedAt: new Date(),
            total: 300,
            items: [
                {
                    id: '1',
                    name: 'Product 1',
                    price: 100
                },
                {
                    id: '2',
                    name: 'Product 2',
                    price: 200
                }
            ]
        },
        {include: [{model: InvoiceItemModel}]})    
        
        const invoice = await repository.find('1');

        expect(invoice.id.id).toEqual('1');
        expect(invoice.name).toEqual('Invoice 1');
        expect(invoice.document).toEqual('Doc 1234');
        expect(invoice.address.street).toEqual('street 1');
        expect(invoice.address.number).toEqual('number 1');
        expect(invoice.address.complement).toEqual('complement 1');
        expect(invoice.address.zipCode).toEqual('zip 1');
        expect(invoice.address.city).toEqual('city 1');
        expect(invoice.address.state).toEqual('state 1');
        expect(invoice.items).toHaveLength(2);
        expect(invoice.items[0].id.id).toEqual('1');
        expect(invoice.items[0].name).toEqual('Product 1');
        expect(invoice.items[0].price).toEqual(100);
        expect(invoice.items[1].id.id).toEqual('2');
        expect(invoice.items[1].name).toEqual('Product 2');
        expect(invoice.items[1].price).toEqual(200);
        expect(invoice.total).toEqual(300);
    });
})