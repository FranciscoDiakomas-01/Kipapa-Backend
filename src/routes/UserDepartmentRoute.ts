import { Router } from "express";
import { CreateUserDepartament, getUserDepartament, UpdateUserDepartament, DeleteuserDepartment } from "../controllers/UserDepartamentController";
import {isAdminToken} from "../middlewares/jwt";
const DepartmentRoute = Router()
DepartmentRoute.get("/categoryUser",isAdminToken , getUserDepartament);
DepartmentRoute.post("/categoryUser", isAdminToken , CreateUserDepartament);
DepartmentRoute.put("/departament/:id", isAdminToken , UpdateUserDepartament);
DepartmentRoute.delete("/departament/:id",isAdminToken , DeleteuserDepartment);
export default DepartmentRoute;