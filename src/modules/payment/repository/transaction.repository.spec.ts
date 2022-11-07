import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction.entity";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";

describe("Transaction Repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save a transaction", async () => {
        const repository = new TransactionRepository();

        const props = {
            id: new Id('1'),
            orderId: '1',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        
        const transaction = new Transaction(props);
        await repository.save(transaction);

        const transactionDb = await TransactionModel.findOne({
            where: {id: props.id.id}
        });

        expect(transactionDb.id).toEqual(props.id.id);
        expect(transactionDb.orderId).toEqual(props.orderId);
        expect(transactionDb.amount).toEqual(props.amount);
        expect(transactionDb.status).toEqual(props.status);

    });
})