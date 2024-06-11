import { Router } from "express";
import { authentificationController } from "../controllers/authentificationController";
const route = Router();
import upload from "../middleware/uploadingImages";

const auth = new authentificationController();
route.post("/login", auth.login);
route.post("/create", upload.single("image"), auth.createUser);
route.get("/getusers", auth.getUsers);
route.post("/update", auth.updateTokens);

export default route;
