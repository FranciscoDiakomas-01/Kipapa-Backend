import { Router } from "express";
import { getAllOrdersByClient ,getAllOrderByStatus ,CreateOrder , UpdateStatusOrder , deleteOrder , getAllOrders} from "../controllers/OrderController";
import { isAdminToken } from "../middlewares/jwt";
import verifyToken from "../middlewares/jwt";
const OrderRoute = Router()

OrderRoute.post("/order", isAdminToken, getAllOrders);
OrderRoute.get("/ordersbyclient/:clientId", verifyToken , getAllOrdersByClient);
OrderRoute.get("/ordersbystatus/:status", verifyToken , getAllOrderByStatus);
OrderRoute.post("/order", verifyToken , CreateOrder);
OrderRoute.put("/order/:id/:status", verifyToken , UpdateStatusOrder);
OrderRoute.delete("/order/:id",isAdminToken , deleteOrder);
export default OrderRoute