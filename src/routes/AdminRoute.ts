import { Router } from "express";
import { getAdminData, UpdateAdmin } from "../controllers/AdminController";
import { isAdminToken } from "../middlewares/jwt";
const AdminRoute = Router()
AdminRoute.get("/admin", isAdminToken , getAdminData);
AdminRoute.put("/admin", isAdminToken ,UpdateAdmin);
export default AdminRoute