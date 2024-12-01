import { Router } from "express";
import { getAllClient ,createClient , getClientyId , deleteCient , updateClient } from "../controllers/ClientController";
import { isAdminToken } from "../middlewares/jwt";
import verifyToken from "../middlewares/jwt";
const ClientRoute = Router()
ClientRoute.get("/clients", isAdminToken, getAllClient);
ClientRoute.post("/client", createClient);
ClientRoute.get("/client/:id", verifyToken, getClientyId);
ClientRoute.delete("/client/:id", isAdminToken , deleteCient);
ClientRoute.put("/client/:id", verifyToken, updateClient);

export default ClientRoute