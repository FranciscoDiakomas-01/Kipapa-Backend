import { Request , Response } from "express";
import dotenv from 'dotenv'
import ConnectionDB from "../database/dbConnection";
dotenv.config()
import { IProductCategory } from "../types/types";
const db = ConnectionDB;
export async function getAllCategoryProduct(req: Request, res: Response) {
    const id = Number(req.query.id);
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query('SELECT id from productcategory')
    const latPage = Math.ceil(Number(rowCount) / limit);
    if (id) {
        await db.query(
          "SELECT id , title , description, img_url FROM productcategory WHERE id = $1;",
          [id],
          async (err, result) => {
            res.status(200).json({
              data: result.rowCount != 0 ? result.rows : "not found",
            });
            
            return
          }
        );
        return;
    } else {
            await db.query(
              "SELECT id, title , description , img_url FROM productcategory   ORDER BY id DESC LIMIT $1 OFFSET $2;",
              [limit, offset],
              async (err, result) => {
                res.status(200).json({
                  data: result?.rows,
                  total: rowCount,
                  page,
                  latPage,
                });
                return
              }
            );
    }
}

export async function CreateCategoryFood(req: Request, res: Response) {
    if (!req.body.file) {
        res.status(400).json({
            error : 'must contain a file'
        })
        return
    }
    const CategoryFood: IProductCategory = {
      title: req.body.title,
      decription: req.body.desription,
      image_url: req.body.file,
    };
if (CategoryFood.title?.length >= 5 && CategoryFood.title?.length < 20) {
    await db.query("INSERT INTO productcategory(title , description , img_url) VALUES ($1 , $2 , $3)",[CategoryFood.title, CategoryFood.decription , CategoryFood.image_url],async (err, result) => {
        if (err) {
            res.status(400).json({
                error: "alreary exist",
            });
            return
        } else {
            res.status(201).json({
                data: "created",
            });
            return
        }
    });
} else {
    res.status(400).json({
      error: "inavlid body",
    });
    return
  }
}

export async function UpdateCategoryFoodBody(req: Request, res: Response) {
  const id = Number(req.params.id);
  const FoodCategory: Omit<IProductCategory, "image_url"> = {
    title: req.body.title,
    decription: req.body.desription,
  };
  if (FoodCategory.title?.length >= 5 && FoodCategory.title?.length < 20) {
    await db.query("UPDATE productcategory SET description = $1 ,title = $2  WHERE id = $3", [FoodCategory.decription, FoodCategory.title, id], (err, result) => {
      if (err) {
        res.status(400).json({
        error : 'already exists' + err.message
        })
        return 
    }
       res.status(200).json({
         data: result.rowCount != 0 ? "updated" : "not found",
       });
      return ;
    })
   
  } else {
    res.status(400).json({
      error: "inavlid body",
    });
    return
  }
}

export async function DeleteCategoryProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  
  if (!isNaN(id)) {
    db.query("DELETE FROM productcategory WHERE id = $1;",[id],async (err, result) => {
        res.status(201).json({
          data: result.rowCount != 0 ? "deleted" : "not found",
        });
        return
      }
    );
  } else {
    res.status(400).json({
      error: "inavlid id",
    });
    return
  }
}
