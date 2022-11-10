import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create()
    try {
        const inputDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        };
        const outputDto = await facade.addProduct(inputDto)
        res.send(outputDto);
    } catch (err) {
        res.status(500).send(err);
    }
});
