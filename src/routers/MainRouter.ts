import { Router } from "express";
import AuthRouter from "./AuthRouter/AuthRouter";
import OtherRouter from "./OtherRouter/OtherRouter";

const MainRouter = Router();

MainRouter.use("/other", OtherRouter);
MainRouter.use("/auth", AuthRouter);

export default MainRouter;
