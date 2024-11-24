import { Router } from "express";
import { CreatePayForm, DeletePayForm, UpdatePayForm, getPayForms } from "../controllers/PayMethodController";
import  {isAdminToken} from "../middlewares/jwt";
const PayFormRoute = Router()
PayFormRoute.get("/payform" , getPayForms);
PayFormRoute.post("/payform", isAdminToken ,CreatePayForm);
PayFormRoute.put("/payform/:id", isAdminToken , UpdatePayForm);
PayFormRoute.delete("/payform/:id", isAdminToken , DeletePayForm);
export default PayFormRoute;