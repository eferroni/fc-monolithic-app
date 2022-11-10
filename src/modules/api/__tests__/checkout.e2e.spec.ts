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
    expect(checkoutResponse.body.status).toBe('approved');
    expect(checkoutResponse.body.total).toBe(100);
    expect(checkoutResponse.body.products).toHaveLength(1);
    expect(checkoutResponse.body.products[0].productId).toBe(productId);
  });
});
