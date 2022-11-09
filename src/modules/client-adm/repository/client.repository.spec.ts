import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";

describe("Client Repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        const clientRepository = new ClientRepository();

        const clientProps = {
            id: new Id('1'),
            name: 'Client 1',
            email: 'x@x.com',
            street: 'Street 1',
            number: '1',
            complement: '2',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        
        const client = new Client(clientProps);
        await clientRepository.add(client);

        const clientDb = await ClientModel.findOne({
            where: {id: clientProps.id.id}
        });

        expect(clientDb.id).toEqual(clientProps.id.id);
        expect(clientDb.name).toEqual(clientProps.name);
        expect(clientDb.email).toEqual(clientProps.email);
        expect(clientDb.street).toEqual(clientProps.street);
        expect(clientDb.number).toEqual(clientProps.number);
        expect(clientDb.complement).toEqual(clientProps.complement);
        expect(clientDb.city).toEqual(clientProps.city);
        expect(clientDb.state).toEqual(clientProps.state);
        expect(clientDb.zipCode).toEqual(clientProps.zipCode);

    });

    it("should find a client", async () => {
        const clientRepository = new ClientRepository();

        await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'x@x.com',
            document: '',
            street: 'Street 1',
            number: '1',
            complement: '2',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        
        const client = await clientRepository.find('1');

        expect(client.id.id).toEqual('1');
        expect(client.name).toEqual('Client 1');
        expect(client.email).toEqual('x@x.com');
        expect(client.street).toEqual('Street 1');
        expect(client.number).toEqual('1');
        expect(client.complement).toEqual('2');
        expect(client.city).toEqual('City 1');
        expect(client.state).toEqual('State 1');
        expect(client.zipCode).toEqual('Zip 1');

    })
})