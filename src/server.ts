import express , {Application} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectionDb from './database/dbConnection'
import RunnMigrations from './database/runnMigration'
import CreateDefaultAdmin from './database/createDefaultAdmin'
import ClientRoute from './routes/ClientRoute'
import FoodCategoryRoute from './routes/CategoryFoodRoute'
import PayFormRoute from './routes/PayMethodRouter';
import FoodRoute from './routes/FoodRoute';
import OrderRoute from './routes/OrderRoute';
import AdminRoute from './routes/AdminRoute';
import LoginRoute from './routes/LoginRoute';
dotenv.config()
async function StartServer() {
    const server: Application = express();
    const port = process.env.PORT;
    const db = ConnectionDb;
    await RunnMigrations(db)
    try {
        await CreateDefaultAdmin(db);
    } catch (error) {
        await CreateDefaultAdmin(db);
    }
    //glogal middleware
    server.use(cors());
    server.use(express.json());
    //routes
    server.use(ClientRoute);
    server.use(FoodCategoryRoute);
    server.use(PayFormRoute);
    server.use(FoodRoute);
    server.use(OrderRoute);
    server.use(LoginRoute);
    server.use(AdminRoute);

    server.get("/", (req, res) => {
        res.send({ msg: "Bem Vindo ao Kipapa!" });
    });

    server.listen(port, () => {
    console.log("Server Running!");
    });
}
StartServer()