import { Router } from "express";
import upload from "../middlewares/upload";
import { getAllCategoryProduct, CreateCategoryFood, DeleteCategoryProduct, UpdateCategoryFoodBody, UpdateCategoryFoodFile } from "../controllers/FoodCategoryController";
import { isAdminToken } from "../middlewares/jwt";
const FoodCategoryRoute = Router()
FoodCategoryRoute.get("/foodcategorys", getAllCategoryProduct);
FoodCategoryRoute.post("/foodcategory", isAdminToken , upload.single('file'),CreateCategoryFood);
FoodCategoryRoute.put("/foodcategory/:id", isAdminToken , UpdateCategoryFoodBody);
FoodCategoryRoute.put("/foodcategoryFile/:id", isAdminToken ,upload.single('file') , UpdateCategoryFoodFile);
FoodCategoryRoute.delete("/foodcategory/:id", isAdminToken ,DeleteCategoryProduct);
export default FoodCategoryRoute;