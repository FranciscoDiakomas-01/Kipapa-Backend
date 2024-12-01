import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import ConnectionDB from "../database/dbConnection";
import { IUser } from "../types/types";
import isUser, { isClient } from "../services/UserValidation";
dotenv.config();
const db = ConnectionDB;

export async function getAllClient(req: Request, res: Response) {
  
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 10;
  const offset: number = (page - 1) * limit;
  const { rows } = await db.query("SELECT count(*) as total FROM clients;");
  const laspage = Math.ceil(Number(rows[0]?.total) / limit);
  db.query(
    "SELECT clients.id , clients.name , clients.lastname, clients.email , to_char(clients.created_at , 'DD/MM/YYYY') as created_at,to_char(clients.updated_at , 'DD/MM/YYYY') as updated_at , clients.adress FROM clients ORDER BY clients.id DESC LIMIT $1 OFFSET $2 ",
    [limit, offset],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          data: result.rows,
          total: rows[0]?.total,
          page,
          limit,
          laspage,
        });
      }
    }
  );
}

export async function getClientyId(req: Request, res: Response) {
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  if (id) {
    return db.query(
      "SELECT clients.id , clients.name ,   clients.lastname, clients.email , to_char(clients.created_at , 'DD/MM/YYYY') as created_at,to_char(clients.updated_at , 'DD/MM/YYYY') as updated_at , clients.adress FROM clients WHERE id = $1 LIMIT 1;",
      [id],
      (err, result) => {
        res.status(200).json({
          data: result?.rows,
        });
        return;
      }
    );
  } else {
    res.status(400).json({
      data: "invalid id",
    });
    return;
  }
}

export async function createClient(req: Request, res: Response) {
  const client: Omit<IUser, "categoryId"> = {
    email: req.body?.email,
    name: req.body?.name,
    lastname: "",
    password: CryptoJS.AES.encrypt(
      req.body.password,
      String(process.env.ENC_PASS)
    ).toString(),
    adress: {
      city: "",
      cep: 0,
      qoute: "",
    },
  };
  if (req?.body.password?.length < 8) {
    res.status(404).json({
      error: "invalid password",
    });
    return;
  }
  db.query("INSERT INTO clients(name , lastname , email , password , adress ) VALUES($1 , $2 , $3 , $4 , $5) RETURNING id;",
      [client.name, client.lastname, client.email, client.password , JSON.stringify(client.adress)],
      async (err, result) => {
        if (err) {
          res.status(400).json({
            error: "email already exist",
          });
          return;
        } else {
          res.status(201).json({
            data: result.rows[0]?.id,
          });
          return;
        }
      }
    );
  
}

export async function deleteCient(req: Request, res: Response) {
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  if (!id) {
    res.status(400).json({
      error: "invalid id",
    });
    return;
  } else {
    const { rowCount } = await db.query("DELETE FROM clients WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      msg: rowCount == 1 ? "deleted" : "not found",
    });
    return
  }
}

export async function updateClient(req: Request, res: Response) {
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  interface IPassWord {
    olPassWord: string;
    newPassWord: string;
  }

  const password: IPassWord = {
    newPassWord: req.body.password,
    olPassWord: req.body.olPassWord,
  };
  if (password.newPassWord?.length < 8 || password.olPassWord?.length < 8) {
    res.status(400).json({
      error: "invalid password",
    });
    return;
  }
  if (!id) {
    res.status(400).json({
      error: "invalid id",
    });
    return;
  } else {
    //comparar as palavras senhas
    try {
      const { rows, rowCount } = await db.query(
        "SELECT password FROM clients WHERE id = $1 LIMIT 1;",
        [id]
      );
      if (rowCount != 1) {
        res.status(400).json({
          error: "client not found",
        });
        return
      }
      const oldPassword = CryptoJS.AES.decrypt(rows[0]?.password, String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8);
      const newPassWord = CryptoJS.AES.encrypt(password.newPassWord, String(process.env.ENC_PASS)).toString();
      if (oldPassword == password.olPassWord) {
        const client: Omit<IUser, "categoryId"> = {
          email: req.body?.email,
          name: req.body?.name,
          lastname: req.body?.lastname,
          password: newPassWord,
          adress: {
            city: req.body?.city,
            cep: req.body?.cep,
            qoute: req.body?.qoute,
          },
        };
        if (isClient(client)) {
          await db.query("UPDATE clients SET password = $1 , name = $2 , lastname = $3 , email = $4 , adress = $5 , updated_at = now() WHERE id = $6;",
            [client.password, client.name, client.lastname, client.email, JSON.stringify(client.adress) , id]
          );
          res.status(200).json({
            msg: "updated",
          });
          return
        } else {
          res.status(400).json({
            msg: "invalid client",
          });
          return
        }
      } else {
        res.status(400).json({
          msg: "password doesn´t matches!",
        });
        return
      }
    } catch (error) {}
  }
}
