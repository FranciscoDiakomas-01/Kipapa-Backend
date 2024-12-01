import { Router } from "express";
import { AdminLogin, ClientLogin } from "../controllers/LoginController";
const LoginRoute = Router();
LoginRoute.post("/adminlogin", AdminLogin);
LoginRoute.post("/login", ClientLogin);
export default LoginRoute;
