import { Router } from "express";
import { authentificationController } from "../controllers/authentificationController";
const route = Router();

const auth = new authentificationController();
route.post("/login", auth.login);
route.post("/create",auth.createUser);
route.get("/getusers",auth.getUsers);
route.post("/updateusers",auth.updateTokens);


export default route;
