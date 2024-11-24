import { Router } from "express";
import upload from "../middlewares/upload";
import { getProduct , DeleteProduct , CreateProduct , UpdateProductBody ,UpdateProductFile} from "../controllers/FoodController";
const FoodRoute = Router()
import { isAdminToken } from "../middlewares/jwt";
FoodRoute.get('/product', getProduct)
FoodRoute.post("/product",isAdminToken , upload.single("file"), CreateProduct);
FoodRoute.put("/product/:id", isAdminToken ,UpdateProductBody);
FoodRoute.put("/productfile/:id", isAdminToken , upload.single("file"), UpdateProductFile);
FoodRoute.delete("/product/:id", isAdminToken ,DeleteProduct);
export default FoodRoute