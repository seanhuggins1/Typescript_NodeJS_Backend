import { Router } from "express";
import { Request, Response } from "express";

const OtherRouter = Router();
OtherRouter.get("/", (request: Request, response: Response) => {
    response.json({ test: "test" });
});
export default OtherRouter;
