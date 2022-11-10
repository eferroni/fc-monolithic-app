import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send({
      name: "Client 1",
      email: "client@email.com",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip 1"
    });
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Client 1");
    expect(response.body.email).toBe("client@email.com");
    expect(response.body.street).toBe('Street 1');
    expect(response.body.number).toBe('Number 1');
    expect(response.body.complement).toBe('Complement 1');
    expect(response.body.city).toBe('City 1');
    expect(response.body.state).toBe('State 1');
    expect(response.body.zipCode).toBe('Zip 1');
  });
});
