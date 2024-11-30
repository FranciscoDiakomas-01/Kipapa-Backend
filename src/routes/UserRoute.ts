import { Router } from "express";
import { getAllUser ,createUser , filterUser , deleteUser , updateUser , getAllDisponilbeUserByCategory } from "../controllers/UserController";
import verifyToken , { isAdminToken }  from "../middlewares/jwt";
const UserRoute = Router()
UserRoute.get("/users", verifyToken, getAllUser);
UserRoute.post("/user", isAdminToken ,createUser);
UserRoute.get("/user/:id/:filter", verifyToken ,filterUser);
UserRoute.get("/userdisponilbe/:categoryId", verifyToken, getAllDisponilbeUserByCategory);
UserRoute.delete("/user/:id", isAdminToken , deleteUser);
UserRoute.put("/user/:id", verifyToken, updateUser);

export default UserRoute