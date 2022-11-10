import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import ClientRepository from "../../client-adm/repository/client.repository";
import AddClientUseCase from "../../client-adm/usecase/add-client/add-client.usecase";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const facade = ClientAdmFacadeFactory.create()
    try {
        const inputDto = {
            name: req.body.name,
            email: req.body.email,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        };
        const output = await facade.add(inputDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});
