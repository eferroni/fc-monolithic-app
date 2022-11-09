import { number } from "yup";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Add Client Usecase unit test", () => {
    it("should add a client", async () => {
        const repository = MockRepository();
        const usecase = new AddClientUseCase(repository);
        const input = {
            name: 'Client 1',
            email: 'x@x.com',
            street: 'Street 1',
            number: 'Number 1',
            complement: 'Complement 1',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1',
        }
        const result = await usecase.execute(input);
        expect(repository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
    })
})