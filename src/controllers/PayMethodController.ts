import { Response, Request } from "express";
import ConnectionDB from "../database/dbConnection";
import dotenv from "dotenv";
dotenv.config();

export async function getPayForms(req: Request, res: Response) {
  const db = await ConnectionDB();
  const id = Number(req.query.id);
  if (id) {
    db.query(
      "SELECT id , title ,  to_char(created_at , 'DD/MM/YYYY') as created_at,to_char(updated_at , 'DD/MM/YYYY') as updated_at   FROM payforms WHERE id = $1;",
      [id],
      async (err, result) => {
        res.status(200).json({
          data: result.rows,
        });
        return await db.end();
      }
    );
    return;
  }
  db.query(
    "SELECT id , title ,  to_char(created_at , 'DD/MM/YYYY') as created_at,to_char(updated_at , 'DD/MM/YYYY') as updated_at  FROM payforms;",
    async (err, result) => {
      res.status(200).json({
        data: result.rows,
        total: result.rowCount,
      });
      return await db.end();
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
  const db = await ConnectionDB();
  db.query(
    "INSERT INTO payforms(title) VALUES($1)",
    [title?.toUpperCase()],
    async (err, result) => {
      if (err) {
        res.status(400).json({
          error: "alreary exist",
        });
        return await db.end();
      } else {
        res.status(201).json({
          data: "created",
        });
        return await db.end();
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
  const db = await ConnectionDB();
  db.query(
    "UPDATE payforms SET title = $1 , updated_at = now() WHERE id =$2",
    [title?.toUpperCase(), id],
    async (err, result) => {
      if (err) {
        res.status(400).json({
          error: "alreary exist",
        });
        return await db.end();
      } else {
        res.status(201).json({
          data: "updated",
        });
        return await db.end();
      }
    }
  );
}
export async function DeletePayForm(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  if (!isNaN(id)) {
    db.query(
      "DELETE FROM payforms WHERE id = $1;",
      [id],
      async (err, result) => {
        res.status(201).json({
          data: result.rowCount != 0 ? "deleted" : "not found",
        });
        return await db.end();
      }
    );
  } else {
    res.status(400).json({
      error: "inavlid id",
    });
    return await db.end();
  }
}
