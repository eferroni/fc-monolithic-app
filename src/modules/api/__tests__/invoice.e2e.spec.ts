import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout/order", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // await sequelize.close();
    });

    it("should create a checkout/order", async () => {
        const productResponse = await request(app).post("/products").send({
            name: "Product 1",
            description: 'Product 1 Description',
            purchasePrice: 100,
            stock: 10
        });
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.id).toBeDefined();

        const clientResponse = await request(app).post("/clients").send({
            name: "Client 1",
            email: "client@email.com",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip 1"
        });
        expect(clientResponse.status).toBe(200);
        expect(clientResponse.body.id).toBeDefined();
        
        const productId = productResponse.body.id
        const clientId = clientResponse.body.id
        
        const checkoutResponse = await request(app).post("/checkout").send({
        clientId: clientId,
        products: [
            {
                productId: productId
            },
        ],
        });
        expect(checkoutResponse.status).toBe(200);
        expect(checkoutResponse.body.id).toBeDefined();
        expect(checkoutResponse.body.invoiceId).toBeDefined();

        const invoiceId = checkoutResponse.body.invoiceId;
        const invoiceResponse = await request(app).get(`/invoice/${invoiceId}`).send();
        expect(invoiceResponse.status).toBe(200);
        expect(invoiceResponse.body.id).toBe(invoiceId);
        expect(invoiceResponse.body.name).toBe('Client 1');
        expect(invoiceResponse.body.document).toBeDefined();
        expect(invoiceResponse.body.address.street).toBe('Street 1');
        expect(invoiceResponse.body.address.number).toBe('Number 1');
        expect(invoiceResponse.body.address.complement).toBe('Complement 1');
        expect(invoiceResponse.body.address.city).toBe('City 1');
        expect(invoiceResponse.body.address.state).toBe('State 1');
        expect(invoiceResponse.body.address.zipCode).toBe('Zip 1');
        expect(invoiceResponse.body.items).toHaveLength(1);
        expect(invoiceResponse.body.items[0].id).toBe(productId);
        expect(invoiceResponse.body.items[0].name).toBe('Product 1');
        expect(invoiceResponse.body.items[0].price).toBe(100);
        expect(invoiceResponse.body.total).toBe(100);
        expect(invoiceResponse.body.createdAt).toBeDefined();
    });
});
