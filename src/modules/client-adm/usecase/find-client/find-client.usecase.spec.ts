import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const props = {
    id: new Id('1'),
    name: 'Client 1',
    email: 'x@x.com',
    street: 'Street 1',
    number: 'Number 1',
    complement: 'Complement 1',
    city: 'City 1',
    state: 'State 1',
    zipCode: 'Zip 1'
}
const client = new Client(props);


const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    };
};

describe("Find Client Usecase unit test", () => {
    it("should find a client", async () => {
        const repository = MockRepository();
        const usecase = new FindClientUseCase(repository);
        const input = {
            id: '1',
        }
        const result = await usecase.execute(input);
        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual('1');
        expect(result.name).toEqual('Client 1');
        expect(result.email).toEqual('x@x.com');
        expect(result.street).toEqual('Street 1');
        expect(result.number).toEqual('Number 1');
        expect(result.complement).toEqual('Complement 1');
        expect(result.city).toEqual('City 1');
        expect(result.state).toEqual('State 1');
        expect(result.zipCode).toEqual('Zip 1');
    })
})