import ConnectionDB from "../database/dbConnection";
import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv'
dotenv.config()
import { IAdmin } from "../types/types";
import { isAvaliableAdmin } from "../services/validationAdmin";
const db = ConnectionDB
export async function UpdateAdmin(req: Request, res: Response) {
    if (req.body?.password?.length < 8 &&req.body?.password?.oldpassword &&req.body?.password?.oldpassword?.length < 8) {
      res.status(400).json({
        error: "invalid pasword",
      });
      return;
    }

    const admin: IAdmin = {
        adress: {
            cep: req.body.cep,
            city: req.body.city,
            qoute : req.body.qoute
        },
        email: req.body.email,
        name: req.body.name,
        olPassWord: req.body.oldpassword,
        password : req.body.password
    }
    if (isAvaliableAdmin(admin)) {
        //verificar se a palavras passes batem!
        const { rows, rowCount } = await db.query("SELECT password FROM delivery WHERE id = 1 LIMIT 1;");
        if (rowCount != 1) {
            res.status(400).json({
                error: "client not found",
            });
            return
        }
        const oldPassword = CryptoJS.AES.decrypt(rows[0]?.password, String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8);
        console.log(oldPassword)
      const newPassWord = CryptoJS.AES.encrypt(admin.password,String(process.env.ENC_PASS)).toString();
      if(oldPassword == admin.olPassWord){
        await db.query("UPDATE delivery SET password = $1 , name = $2 , email = $3 , adress = $4 , updated_at = now() WHERE id = 1;",
            [newPassWord, admin.name, admin.email, JSON.stringify(admin.adress)]
          );
          res.status(200).json({
            msg: "updated",
          });
          return
      } else {
          res.status(400).json({
            msg: "wrong password",
          });
          return
      }
    } else {
        res.status(400).json({
            msg: "invalid admin body",
        });
        return
    }
}

export async function getAdminData(req: Request, res: Response) {
    await db.query("SELECT id ,  name , email ,to_char(created_at , 'MM/DD/YYYY - HH:mi') as created_at , to_char(updated_at , 'MM/DD/YYYY - HH:mi') as updated_at   FROM delivery;", (err, result) => {
        if (err) {
            res.status(400).json({
                error : err.message
            })
        } else {
            res.status(200).json({
                data : result.rows
            })
        }
    });
}

export async function DashBoard(req: Request, res: Response) {
await db.query(
    `
    SELECT count(*) as total from product
              UNION ALL
    SELECT count(*) as total from productcategory
              UNION ALL
    SELECT count(*) as total from orders
              UNION ALL
    SELECT count(*) as total from clients;
  `,
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({
          error: err.message,
        });
        return;
      } else {
        res.status(200).json({
          data: result.rows,
        });
        return;
      }
    }
  );
}