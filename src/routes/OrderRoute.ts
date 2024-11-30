import { Router } from "express";
import { getOrderByID ,getAllOrderByStatus ,CreateOrder , UpdateStatusOrder , deleteOrder , getAllOrders , AddDelivery} from "../controllers/OrderController";
import { isAdminToken } from "../middlewares/jwt";
import verifyToken from "../middlewares/jwt";
const OrderRoute = Router()

OrderRoute.get("/order", isAdminToken, getAllOrders);
OrderRoute.get("/ordersbyclient/:orderId", verifyToken, getOrderByID);
OrderRoute.get("/ordersbystatus/:status", verifyToken , getAllOrderByStatus);
OrderRoute.post("/order", verifyToken , CreateOrder);
OrderRoute.put("/order/:id/:status", verifyToken , UpdateStatusOrder);
OrderRoute.put("/orderUser/:id/:userId", isAdminToken, AddDelivery);
OrderRoute.delete("/order/:id",isAdminToken , deleteOrder);
export default OrderRoute