import { Request , Response } from "express";
import dotenv from 'dotenv'
import ConnectionDB from "../database/dbConnection";
import fs  from "node:fs";
dotenv.config()
import { IProductCategory } from "../types/types";
import deleteUpLoadedFile from "../services/deleteUploadedFile";
export async function getAllCategoryProduct(req: Request, res: Response) {
    const db = await ConnectionDB();
    const id = Number(req.query.id);
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query('SELECT id from productcategory')
    const latPage = Math.floor(Number(rowCount) / limit)
    if (id) {
        db.query(
          "SELECT id , title , description, to_char(created_at , 'DD/MM/YYYY') as created_at , to_char(updated_at , 'DD/MM/YYYY') as updated_at , img_url FROM productcategory WHERE id = $1;",
          [id],
          async (err, result) => {
            res.status(200).json({
              data: result.rowCount != 0 ? result.rows : "not found",
            });
            return await db.end();
          }
        );
        return;
    } else {
            db.query(
              "SELECT id, title , description , to_char(created_at , 'DD/MM/YYYY') as created_at , to_char(updated_at , 'DD/MM/YYYY') as updated_at , img_url FROM productcategory   ORDER BY id DESC LIMIT $1 OFFSET $2;",
              [limit, offset],
              async (err, result) => {
                res.status(200).json({
                  data: result?.rows,
                  total: result.rowCount,
                  page,
                  limit,
                  latPage,
                });
                return await db.end();
              }
            );
    }
}

export async function CreateCategoryFood(req: Request, res: Response) {
    if (!req.file) {
        res.status(400).json({
            error : 'must contain a file'
        })
        return
    }
    const db = await ConnectionDB();
    const CategoryFood: IProductCategory = {
      title: req.body.title,
      decription: req.body.desription,
      image_url: String(process.env.SERVER_PATH + req.file?.filename),
    };
if (CategoryFood.title?.length >= 5 && CategoryFood.title?.length < 20) {
    db.query("INSERT INTO productcategory(title , decription , img_url) VALUES ($1 , $2 , $3)",[CategoryFood.title, CategoryFood.decription , CategoryFood.image_url],async (err, result) => {
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
    });
} else {
    res.status(400).json({
      error: "inavlid body",
    });
    return await db.end();
  }
}

export async function UpdateCategoryFoodBody(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  const FoodCategory: Omit<IProductCategory, "image_url"> = {
    title: req.body.title,
    decription: req.body.desription,
  };
  if (FoodCategory.title?.length >= 5 && FoodCategory.title?.length < 20) {
    await db.query("UPDATE productcategory SET decription = $1 ,title = $2 , updated_at = now() WHERE id = $3", [FoodCategory.decription, FoodCategory.title, id], (err, result) => {
      if (err) {
        res.status(400).json({
        error : 'already exists'
        })
        return db.end()
    }
       res.status(200).json({
         data: result.rowCount != 0 ? "updated" : "not found",
       });
      return db.end();
    })
   
  } else {
    res.status(400).json({
      error: "inavlid body",
    });
    return await db.end();
  }
}

export async function UpdateCategoryFoodFile(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  if (req.file) {

    const { rows } = await db.query("SELECT img_url FROM productcategory WHERE id = $1 LIMIT 1;", [id]);
    const fileTodelete = String(rows[0]?.img_url);
    const image_url = String(String(process.env.SERVER_PATH) + req.file?.filename)
    const { rowCount } = await db.query("UPDATE productcategory SET img_url = $1 , updated_at = now() WHERE id = $2", [image_url, id]);
    if (rowCount == 1) {
      //deletar o arquivo passado caso Ele exista
      await deleteUpLoadedFile(String(fileTodelete));
      res.status(200).json({
        data: "updated"
      });
      return db.end()
    } else {
      fs.unlinkSync(req.file.path)
      res.status(404).json({
        data: "not found",
      });
      return db.end();
    }
  } else {
    res.status(400).json({
      error : 'invalid file'
    })
  }
  
}

export async function DeleteCategoryProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  if (!isNaN(id)) {
    //pegar o caminho do arquivo para eliminar
    const { rows } = await db.query("SELECT img_url FROM productcategory WHERE id = $1 LIMIT 1;", [id]);
    await deleteUpLoadedFile(String(rows[0]?.img_url));
    db.query("DELETE FROM productcategory WHERE id = $1;",[id],async (err, result) => {
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
