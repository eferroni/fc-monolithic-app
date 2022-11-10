import { Sequelize } from "sequelize-typescript"
import InvoiceFacadeFactory from "../factory/invoice.factory";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/invoice-item.model";

describe("Invoice Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([InvoiceModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {        
        const facade = InvoiceFacadeFactory.create()

        const input = {
            id: '1',
            name: 'Invoice 1',
            document: 'Doc 1',
            street: 'street 1',
            number: 'number 1',
            complement: 'complement 1',
            city: 'city 1',
            state: 'state 1',
            zipCode: 'zip 1',
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
        };

        await facade.generate(input);

        const invoice = await InvoiceModel.findOne({
            where: {id: '1'},
            include: ['items']
        });
        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(input.id);
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.street).toBe(input.street);
        expect(invoice.number).toBe(input.number);
        expect(invoice.complement).toBe(input.complement);
        expect(invoice.zipCode).toBe(input.zipCode);
        expect(invoice.city).toBe(input.city);
        expect(invoice.state).toBe(input.state);
        expect(invoice.items).toHaveLength(2)
    });

    it("should find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create()

        const input = {
            id: '1',
            name: 'Invoice 1',
            document: 'Doc 1',
            street: 'street 1',
            number: 'number 1',
            complement: 'complement 1',
            city: 'city 1',
            state: 'state 1',
            zipCode: 'zip 1',
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
        };

        await facade.generate(input);

        const result = await facade.find({id: '1'});
        expect(result.id).toBe(input.id)
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.address.street).toBe(input.street);
        expect(result.address.number).toBe(input.number);
        expect(result.address.complement).toBe(input.complement);
        expect(result.address.zipCode).toBe(input.zipCode);
        expect(result.address.city).toBe(input.city);
        expect(result.address.state).toBe(input.state);
        expect(result.items).toHaveLength(2)
    })
});