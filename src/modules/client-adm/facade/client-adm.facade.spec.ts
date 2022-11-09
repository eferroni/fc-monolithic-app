import { Sequelize } from "sequelize-typescript"
import ClientAdmFacadeFactory from "../factory/facade.factory";
import ClientModel from "../repository/client.model";

describe("Client Adm Facade test", () => {
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
        const facade = ClientAdmFacadeFactory.create()

        const input = {
            id: '1',
            name: 'Client 1',
            email: 'x@x.com',
            street: 'Street 1',
            number: 'Number 1',
            complement: 'Complement 1',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1'
        };

        await facade.add(input);

        const client = await ClientModel.findOne({where: {id: '1'}});

        expect(client).toBeDefined();
        expect(client.id).toBe(input.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.street).toBe(input.street);
        expect(client.number).toBe(input.number);
        expect(client.complement).toBe(input.complement);
        expect(client.city).toBe(input.city);
        expect(client.state).toBe(input.state);
        expect(client.zipCode).toBe(input.zipCode);
    });

    it("should find a client", async () => {
        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'x@x.com',
            document: '',
            street: 'Street 1',
            number: 'Number 1',
            complement: 'Complement 1',
            city: 'City 1',
            state: 'State 1',
            zipCode: 'Zip 1',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const facade = ClientAdmFacadeFactory.create()

        const input = {
            id: '1',
        }

        const result = await facade.find(input);

        expect(result.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.street).toEqual(client.street);
        expect(result.number).toEqual(client.number);
        expect(result.complement).toEqual(client.complement);
        expect(result.city).toEqual(client.city);
        expect(result.state).toEqual(client.state);
        expect(result.zipCode).toEqual(client.zipCode);
    });
});