import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    const facade = InvoiceFacadeFactory.create()
    
    try {
        const inputDto = {
            id: req.params.id
        };
        const output = await facade.find(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});
