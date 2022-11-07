import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../value-object/address";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const address = new Address(
    'Street 1',
    'number 1',
    'complement 1',
    'zip 1',
    'city 1',
    'state 1'
)

const product1 = new Product({
    id: new Id('1'),
    name: 'Product 1',
    price: 100
});

const product2 = new Product({
    id: new Id('2'),
    name: 'Product 2',
    price: 200
});

const invoice = new Invoice({
    id: new Id('1'),
    name: 'Invoice 1',
    document: '1234',
    address: address,
    items: [product1, product2]
})

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Generate Invoice Usecase unit test", () => {
    it("should generate an invoice", async () => {
        // repository
        const repository = MockRepository();

        // input dto
        const input = {
            name: 'Invoice 1',
            document: '1234',
            street: 'Street 1',
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
                },
            ]
        }

        // usecase
        const usecase = new GenerateInvoiceUsecase(repository);
        const result = await usecase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        expect(result.total).toBe(300);
    });
});