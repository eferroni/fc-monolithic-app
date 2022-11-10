import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import ClientModel from "../client-adm/repository/client.model";
import { productRoute } from "./routes/product.route";
import OrderModel from "../checkout/repository/order.model";
import OrderItemModel from "../checkout/repository/order-item.model";
import ProductCatalogModel from "../store-catalog/repository/product.model";
import { ProductModel as ProductAdmModel } from "../product-adm/repository/product.model";
import { invoiceRoute } from "./routes/invoice.route";
import TransactionModel from "../payment/repository/transaction.model";
import InvoiceModel from "../invoice/repository/invoice.model";
import InvoiceItemModel from "../invoice/repository/invoice-item.model";

export const app: Express = express();

app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    ProductCatalogModel, ProductAdmModel,
    ClientModel,
    OrderModel, OrderItemModel,
    TransactionModel,
    InvoiceModel, InvoiceItemModel
  ]);
  await sequelize.sync();
}
setupDb();