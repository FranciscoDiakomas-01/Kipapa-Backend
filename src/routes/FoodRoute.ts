import { Router } from "express";
import { getProduct , DeleteProduct , CreateProduct , UpdateProductBody , getProductByCategory} from "../controllers/FoodController";
const FoodRoute = Router()
import { isAdminToken } from "../middlewares/jwt";
FoodRoute.get('/product', getProduct)
FoodRoute.get("/productbyCategory/:id", getProductByCategory);
FoodRoute.post("/product",isAdminToken , CreateProduct);
FoodRoute.put("/product/:id", isAdminToken ,UpdateProductBody);
FoodRoute.delete("/product/:id", isAdminToken ,DeleteProduct);
export default FoodRoute