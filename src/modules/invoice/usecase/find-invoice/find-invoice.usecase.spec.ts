import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../../@shared/domain/value-object/address";
import FindInvoiceUsecase from "./find-invoice.usecase";

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
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn()
    }
}

describe("Find Invoice Usecase unit test", () => {
    it("should find an invoice", async () => {
        // repository
        const repository = MockRepository();

        // input dto
        const input = {
            id: '1',
        }

        // usecase
        const usecase = new FindInvoiceUsecase(repository);
        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);
        expect(result.total).toBe(300);
    });
});