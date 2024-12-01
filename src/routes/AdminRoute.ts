import { Router } from "express";
import { getAdminData, UpdateAdmin ,DashBoard } from "../controllers/AdminController";
import { isAdminToken } from "../middlewares/jwt";
const AdminRoute = Router()
AdminRoute.get("/admin", isAdminToken , getAdminData);
AdminRoute.get("/dashBoard", isAdminToken, DashBoard);
AdminRoute.put("/admin", isAdminToken ,UpdateAdmin);
export default AdminRoute