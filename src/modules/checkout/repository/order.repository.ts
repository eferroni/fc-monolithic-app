import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create(
            {
                id: order.id.id,
                client_id: order.client.id.id,
                status: order.status,
                products: order.products.map((p) => ({
                    id: p.id.id,
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice
                })),
            },
            {include: [{ model: OrderItemModel }]}
        );
    }

    async findOrder(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: {id: id},
            include: ['client', 'products']
        })
        
        if (!order) {
            throw new Error(`Order with id ${id} not found`)
        }
        
        const client = new Client({
            id: new Id(order.client.id),
            name: order.client.name,
            email: order.client.email,
            document: order.client.document,
            street: order.client.street,
            number: order.client.number,
            complement: order.client.complement,
            city: order.client.city,
            state: order.client.state,
            zipCode: order.client.zipCode
        });

        const products = order.products.map((p) => new Product({
            id: new Id(p.id),
            name: p.name,
            description: p.description,
            salesPrice: p.salesPrice
        }));
        
        return new Order({
            id: new Id(order.id),
            client: client,
            products: products,
            status: order.status,
        });
    }
}