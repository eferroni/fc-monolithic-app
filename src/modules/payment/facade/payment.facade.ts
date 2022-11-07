import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./facade.interface";

export interface UseCasesProps {
    processPaymentUseCase: UseCaseInterface;
}

export default class PaymentFacade implements PaymentFacadeInterface {
    private _processPaymentUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCasesProps) {
        this._processPaymentUseCase = usecaseProps.processPaymentUseCase;
    }

    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return this._processPaymentUseCase.execute(input);
    }
}