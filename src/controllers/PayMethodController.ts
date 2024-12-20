import { Response, Request } from "express";
import ConnectionDB from "../database/dbConnection";
import dotenv from "dotenv";
dotenv.config();
const db = ConnectionDB;

export async function getPayForms(req: Request, res: Response) {
  
  const id = Number(req.query.id);
  if (id) {
    await db.query(
      "SELECT id , title FROM payforms WHERE id = $1;",
      [id],
      async (err, result) => {
        res.status(200).json({
          data: result.rows,
        });
        return ;
      }
    );
    return;
  }
  await db.query(
    "SELECT id , title  FROM payforms;",
    async (err, result) => {
      res.status(200).json({
        data: result.rows,
        total: result.rowCount,
      });
      return ;
    }
  );
}

export async function CreatePayForm(req: Request, res: Response) {
  const title = req.body.title;
  if (title?.length < 2) {
    res.status(400).json({
      error: "alreary exist",
    });
    return;
  }
  
  await db.query(
    "INSERT INTO payforms(title) VALUES($1)",
    [title?.toUpperCase()],
    async (err, result) => {
      if (err) {
        res.status(400).json({
          error: "alreary exist",
        });
        return ;
      } else {
        res.status(201).json({
          data: "created",
        });
        return ;
      }
    }
  );
}

export async function UpdatePayForm(req: Request, res: Response) {
  const title = req.body.title ? String(req.body.title) : false;
  const id = Number(req.params.id);
  if (title == false || title?.length < 2) {
    res.status(400).json({
      error: "alreary exist",
    });
    return;
  }
  
  await db.query(
    "UPDATE payforms SET title = $1 WHERE id =$2",
    [title?.toUpperCase(), id],
    async (err, result) => {
      if (err) {
        res.status(400).json({
          error: "alreary exist",
        });
        return ;
      } else {
        res.status(201).json({
          data: "updated",
        });
        return ;
      }
    }
  );
}
export async function DeletePayForm(req: Request, res: Response) {
  const id = Number(req.params.id);
  
  if (!isNaN(id)) {
    await db.query(
      "DELETE FROM payforms WHERE id = $1;",
      [id],
      async (err, result) => {
        res.status(201).json({
          data: result.rowCount != 0 ? "deleted" : "not found",
        });
        return ;
      }
    );
  } else {
    res.status(400).json({
      error: "inavlid id",
    });
    return ;
  }
}