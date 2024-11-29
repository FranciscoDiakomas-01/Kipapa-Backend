import { Request , Response } from "express";
import dotenv from 'dotenv'
import ConnectionDB from "../database/dbConnection";
import fs  from "node:fs";
dotenv.config()
import { isProduct, isProductToUpdate } from "../services/productValidation";
import { IProduct } from "../types/types";
import deleteUpLoadedFile from "../services/deleteUploadedFile";


export async function getProductByCategory(req: Request, res: Response) {
  const db = await ConnectionDB();
  const id = Number(req.params?.id);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset: number = (page - 1) * limit;
  if (id) {
    
  const { rowCount } = await db.query("SELECT id from product WHERE category_id = $1 ", [id]);
  const latPage = Math.ceil(Number(rowCount) / limit);
    db.query(
      "SELECT product.id , product.name , product.description , product.current_price , product.old_price , to_char(product.created_at , 'DD/MM/YYYY') as created_at , to_char(product.updated_at , 'DD/MM/YYYY') as updated_at , product.img_url , productCategory.title FROM product JOIN productCategory ON product.category_id = productCategory.id WHERE  product.category_id = productCategory.id and product.category_id = $1 LIMIT $2 OFFSET $3;",
      [id , limit, offset],
      async (err, result) => {
        res.status(200).json({
          data: result?.rows,
          err: err?.message,
          page,
          limit,
          latPage,
          total: rowCount,
        });
        return await db.end();
      }
    );
    return;
  } else {
    res.status(400).json({
      error :'invalid categoryId'
    })
  }
}
export async function getProduct(req: Request, res: Response) {

    const db = await ConnectionDB();
    const id = Number(req.query.id);
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query("SELECT id from product");
    const latPage = Math.ceil(Number(rowCount) / limit)
    if (id) {
        db.query(
          "SELECT product.id , product.name , product.description , product.current_price , product.old_price , to_char(product.created_at , 'DD/MM/YYYY') as created_at , to_char(product.updated_at , 'DD/MM/YYYY') as updated_at , product.img_url , productCategory.title FROM product JOIN productCategory ON product.category_id = productCategory.id WHERE  product.category_id = productCategory.id and product.id = $1 LIMIT 1;",
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
              "SELECT product.id , product.name , product.description , product.current_price , product.old_price , to_char(product.created_at , 'DD/MM/YYYY') as created_at , to_char(product.updated_at , 'DD/MM/YYYY') as updated_at , product.img_url , productCategory.title FROM product JOIN productCategory ON product.category_id = productCategory.id WHERE  product.category_id = productCategory.id ORDER BY id DESC LIMIT $1 OFFSET $2;",
              [limit, offset],
              async (err, result) => {
                res.status(200).json({
                  data: result?.rows,
                  err : err?.message,
                  page,
                  limit,
                  latPage,
                  total: rowCount,
                });
                return await db.end();
              }
            );
    }
}

export async function CreateProduct(req: Request, res: Response) {
    if (!req.file) {
        res.status(400).json({
            error : 'must contain a file'
        })
        return
    }
    const db = await ConnectionDB();
    const Food: IProduct = {
        category_id: Number(req.body.categoryId),
        current_price: Number(req.body.price),
        name: String(req.body.name),
        description: req.body.description,
        img_url: String(process.env.SERVER_PATH + req.file?.filename),
        old_price: Number(req.body.olprice),
    };
    const validation = await isProduct(Food, db)
  const filePath = String(req.file.path);
    if (!validation) {
        fs.unlinkSync(filePath);
        res.status(400).json({
            error : 'invalid product'
        })
        return
    } else {

        db.query("INSERT INTO product(name ,description , img_url , current_price , old_price , category_id ) VALUES ($1 , $2 , $3 , $4 , $5 , $6);", [Food.name , Food.description , Food.img_url , Food.current_price , Food.old_price , Food.category_id]
            , (err, result) => {
              if (err) {
                    fs.unlinkSync(filePath);
                    res.status(400).json({
                    error : 'already exists'
                    })
                    return db.end()
                } else {
                    res.status(201).json({
                        data : 'created',
                    });
                    return db.end();
            }
        })
    }

}

export async function UpdateProductBody(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  const Food: Omit<IProduct, "img_url"> = {
    category_id: Number(req.body.categoryId),
    current_price: Number(req.body.price),
    name: String(req.body.name),
    description: req.body.description,
    old_price: Number(req.body.olprice),
    };
    const validation = await isProductToUpdate(Food, db)
    if (validation) {
        await db.query("UPDATE product SET name = $1, description = $2 , current_price = $3 , old_price = $4, category_id = $5 ,  updated_at = now() WHERE id = $6", [Food.name, Food.description, Food.current_price, Food.old_price, Food.category_id, id], (err, result) => {
            if (err) {
                res.status(400).json({
                    error : 'already exist'
                })
            } else {
                res.status(200).json({
                    data: result.rowCount != 0 ? "updated" : "not found",
                });
            }
            return db.end();
        });
    } else {
        res.status(400).json({
            error: "invalid body",
        });
        return db.end();
    }
}

export async function UpdateProductFile(req: Request, res: Response) {
    const id = Number(req.params.id);
  const db = await ConnectionDB();
  if (req.file) {
    const { rows } = await db.query("SELECT img_url FROM product WHERE id = $1 LIMIT 1;", [id]);
    const fileTodelete = String(rows[0]?.img_url);
    const image_url = String(String(process.env.SERVER_PATH) + req.file?.filename)
    const { rowCount } = await db.query("UPDATE product SET img_url = $1 , updated_at = now() WHERE id = $2", [image_url, id]);
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

export async function DeleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const db = await ConnectionDB();
  if (!isNaN(id)) {
    //pegar o caminho do arquivo para eliminar
    const { rows } = await db.query("SELECT img_url FROM product WHERE id = $1 LIMIT 1;", [id]);
    await deleteUpLoadedFile(String(rows[0]?.img_url));
    db.query("DELETE FROM product WHERE id = $1;",[id],async (err, result) => {
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
