import { Router } from "express";
import { authentificationController } from "../controllers/authentificationController";
const route = Router();

const auth = new authentificationController();
route.post("/login", auth.login);
export default route;
