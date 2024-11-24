import { Router } from "express";
import { AdminLogin } from "../controllers/LoginController";
const LoginRoute = Router();
LoginRoute.post("/adminlogin", AdminLogin);
export default LoginRoute;
