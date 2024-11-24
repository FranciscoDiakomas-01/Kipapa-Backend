import { Router } from "express";
import { getAllUser ,createUser , filterUser , deleteUser , updateUser} from "../controllers/UserController";
import verifyToken , { isAdminToken }  from "../middlewares/jwt";
const UserRoute = Router()
UserRoute.get("/users", verifyToken, getAllUser);
UserRoute.post("/user", isAdminToken ,createUser);
UserRoute.get("/user/:id/:filter", verifyToken ,filterUser);
UserRoute.delete("/user/:id", isAdminToken , deleteUser);
UserRoute.put("/user/:id", verifyToken, updateUser);

export default UserRoute