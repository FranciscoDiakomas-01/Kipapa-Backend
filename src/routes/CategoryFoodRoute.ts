import { Router } from "express";
import { getAllCategoryProduct, CreateCategoryFood, DeleteCategoryProduct, UpdateCategoryFoodBody } from "../controllers/FoodCategoryController";
import { isAdminToken } from "../middlewares/jwt";
const FoodCategoryRoute = Router()
FoodCategoryRoute.get("/foodcategorys", getAllCategoryProduct);
FoodCategoryRoute.post("/foodcategory", isAdminToken ,CreateCategoryFood);
FoodCategoryRoute.put("/foodcategory/:id", isAdminToken , UpdateCategoryFoodBody);
FoodCategoryRoute.delete("/foodcategory/:id", isAdminToken ,DeleteCategoryProduct);
export default FoodCategoryRoute;