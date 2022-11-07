import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Transaction from "../../domain/transaction.entity";
import PaymentGateway from "../../gateway/payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
    private _transactionRepository: PaymentGateway;

    constructor (repository: PaymentGateway) {
        this._transactionRepository = repository;
    }

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const props = {
            amount: input.amount,
            orderId: input.orderId
        }
        const transaction = new Transaction(props);
        transaction.process();

        const persistTransaction = await this._transactionRepository.save(transaction);
        return {
            transactionId: persistTransaction.id.id,
            orderId: persistTransaction.orderId,
            amount: persistTransaction.amount,
            status: persistTransaction.status,
            createdAt: persistTransaction.createdAt,
            updatedAt: persistTransaction.updatedAt
        };
    }
}