import { Router } from "express";
import { createUserValidationSchema } from "../../validation/User.validation";
import { createUserSessionValidationSchema } from "../../validation/UserSession.validation";
import validateRequest from "../../middleware/validateRequest";
import { createUserHandler } from "../../controllers/UserController";
import {
    createUserSessionHandler,
    deleteUserSessionHandler,
    getUserSessionsHandler,
} from "../../controllers/UserSessionController";
import { requiresUser } from "../../middleware/requiresUser";
const AuthRouter = Router();

//register user
//POST /api/auth/user
AuthRouter.post(
    "/user",
    validateRequest(createUserValidationSchema),
    createUserHandler
);

//login
//POST /api/auth/session
AuthRouter.post(
    "/session",
    validateRequest(createUserSessionValidationSchema),
    createUserSessionHandler
);

//get the user's sessions
//GET /api/auth/sessions
AuthRouter.get("/sessions", requiresUser, getUserSessionsHandler);

//logout
//DELETE /api/auth/sessions
AuthRouter.delete("/session", requiresUser, deleteUserSessionHandler);

export default AuthRouter;
