import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../value-object/address";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUsecase implements UseCaseInterface{
    private _invoiceRepository: InvoiceGateway;

    constructor(repository: InvoiceGateway) {
        this._invoiceRepository = repository;
    }

    async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {
        const address = new Address(
            input.street,
            input.number,
            input.complement,
            input.zipCode,
            input.city,
            input.state
        );

        const props = {
            id: new Id(input.id) || new Id(),
            name: input.name,
            document: input.document,
            address: address,
            items: input.items.map((item) => new Product({id: new Id(item.id), name: item.name, price: item.price}))
        };

        const invoice = new Invoice(props)

        await this._invoiceRepository.generate(invoice);
        
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.total,
        }
    }
}