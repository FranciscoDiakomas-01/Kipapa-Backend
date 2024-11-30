import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import {IUser} from "../types/types";
dotenv.config();
import { Pool } from "pg";
export default async function CreateDefaultAdmin(db: Pool) {
  const Admin  = {
    adress: {
      city: "Luanda",
      cep: 111111,
      qoute: "Cacuaco",
    },
    email: String(process.env.DEFAULT_EMAIL),
    name: "Kipapa",
    password: CryptoJS.AES.encrypt(
      String(process.env.DEFAULT_PASS),
      String(process.env.ENC_PASS)
    ).toString()
  };
  //verificando se existe um admin
  const { rowCount } = await db.query(
    "SELECT id  FROM delivery WHERE id = 1 LIMIT 1;"
  );
  if (rowCount == 1) {
    console.log("Admin Already Exist");
  } else {
    await db.query("delete from delivery;");
    await db.query("delete from payForms;");
    await db.query("delete from clients;");
    await db.query("delete from productCategory;");
    await db.query("delete from orders;");
    await db.query(
      "insert into delivery(id , name , email , password , adress)  values($1 , $2 , $3 , $4 , $5);",
      [1, Admin.name, Admin.email, Admin.password, JSON.stringify(Admin.adress)]
    );
    //detelando todos os dados
    console.log("Admin created!");
  }
}
