import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import Address from "../../@shared/domain/value-object/address";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
            total: invoice.total,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            }))
        },
        {include: [{model: InvoiceItemModel}]})
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: {id: id},
            include: ['items']
        })
        
        if (!invoice) {
            throw new Error(`Invoice with id ${id} not found`)
        }
        
        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.zipCode,
                invoice.city,
                invoice.state
            ),
            items: invoice.items.map((item) => new Product({id: new Id(item.id), name: item.name, price: item.price}))
        })
    }
}