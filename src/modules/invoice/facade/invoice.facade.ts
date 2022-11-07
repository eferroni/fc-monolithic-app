import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    generateUseCase: GenerateInvoiceUsecase;
    findUseCase: FindInvoiceUsecase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateUseCase: GenerateInvoiceUsecase;
    private _findUseCase: FindInvoiceUsecase;
    
    constructor(props: UseCaseProps) {
        this._generateUseCase = props.generateUseCase;
        this._findUseCase = props.findUseCase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
        await this._generateUseCase.execute(input);
    }

    async find(id: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findUseCase.execute(id);
    }

}