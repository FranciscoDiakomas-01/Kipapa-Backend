import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import ConnectionDB from "../database/dbConnection";
import { IUser } from "../types/types";
import isUser from "../services/UserValidation";
dotenv.config();
const db = ConnectionDB;

export async function getAllUser(req: Request, res: Response) {
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 10;
  const offset: number = (page - 1) * limit;
  const { rows } = await db.query("SELECT count(*) as total FROM employeds;");
  const laspage = Math.ceil(Number(rows[0]?.total) / limit);
  db.query(
    "SELECT employeds.id ,employeds.name ,  employeds.lastname, employeds.email , employeds.adress , to_char(employeds.created_at , 'DD/MM/YYYY') as created_at,to_char(employeds.updated_at , 'DD/MM/YYYY') as updated_at , categoryEmployed.title as category , categoryEmployed.salary FROM employeds JOIN categoryEmployed ON employeds.category_id = categoryEmployed.id WHERE employeds.category_id = categoryEmployed.id ORDER BY id DESC LIMIT $1 OFFSET $2 ",
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


export async function getAllDisponilbeUserByCategory(req: Request, res: Response) {
  const categoryId = req.params.categoryId
  db.query("SELECT id , concat(name , ' ' , lastname) as name, email FROM employeds WHERE category_id = $1", [categoryId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        data: result.rows,
      });
    }
  });
}

export async function filterUser(req: Request, res: Response) {
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 10;
  const offset: number = (page - 1) * limit;
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  const filter = req.params.filter
  enum filters {
    category = 'category',
    id = 'id'
  }
  if (id && filter?.toLocaleLowerCase() == filters.id) {
      return db.query(
        "SELECT employeds.id , employeds.name ,  employeds.lastname , employeds.email , employeds.adress , to_char(employeds.created_at , 'DD/MM/YYYY') as created_at,to_char(employeds.updated_at , 'DD/MM/YYYY') as updated_at , categoryEmployed.title as category , categoryEmployed.salary FROM employeds JOIN categoryEmployed ON employeds.category_id = categoryEmployed.id WHERE employeds.category_id = categoryEmployed.id AND  employeds.id = $1 LIMIT 1",
        [id],
        (err, result) => {
          res.status(200).json({
            data: result.rows,
            filtred: "id",
          });
          return;
        }
      );
  }
  else{
    const { rows } = await db.query("SELECT count(*) as total FROM employeds;");
    const laspage = Math.floor(Number(rows[0]?.total) / limit);
    db.query(
      "SELECT employeds.id ,  employeds.name ,  employeds.lastname , employeds.email , employeds.adress , to_char(employeds.created_at , 'DD/MM/YYYY') as created_at,to_char(employeds.updated_at , 'DD/MM/YYYY') as updated_at , categoryEmployed.title as category , categoryEmployed.salary FROM employeds JOIN categoryEmployed ON employeds.category_id = categoryEmployed.id WHERE employeds.category_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3 ",
      [id, limit, offset],
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
            filtred: "category",
          });
        }
      }
    );
  }
  
}

export async function createUser(req: Request, res: Response) {
  const user: IUser = {
    adress: {
      city: req.body?.city,
      cep: req.body?.cep,
      qoute: req.body?.qoute,
    },
    email: req.body?.email,
    name: req.body?.name,
    lastname: req.body?.lastname,
    password: CryptoJS.AES.encrypt(req.body.password, String(process.env.ENC_PASS)).toString(),
    categoryId: req.body?.categoryId,
  };
  if (req?.body.password?.length < 8) {
      res.status(404).json({
        error: "invalid password",
      });
    return
  }
  if (isUser(user)) {
  
      const { rowCount } = await db.query("SELECT id from categoryEmployed WHERE id = $1 LIMIT 1", [user.categoryId]);
      if (rowCount == 1) {
        await db.query("INSERT INTO employeds(name , lastname , email , password , adress , category_id) VALUES($1 , $2 , $3 , $4 , $5 , $6) RETURNING id;", [user.name, user.lastname, user.email, user.password, JSON.stringify(user.adress), user.categoryId], async (err, result) => {
          ;
          if (err) {
            res.status(400).json({
              error : 'email already exist'
            })
            return 
          } else {
            res.status(201).json({
              data : result.rows[0]?.id
            });
            return 
          }
        });
      } else {
        res.status(404).json({
            error : 'invalid category'
        })
        
        return
      }

  } else {
    res.status(400).json({
      error : 'invalid user'
    })
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  if (!id) {
    res.status(400).json({
      error : 'invalid id'
    })
    return
  } else {
    
    const { rowCount } = await db.query("DELETE FROM employeds WHERE id = $1", [id]);
    res.status(200).json({
      msg : rowCount == 1 ? 'deleted' : 'not found'
    })
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = !isNaN(Number(req.params.id)) ? req.params.id : false;
  interface IPassWord {
    olPassWord : string,
    newPassWord : string
  }

  const password: IPassWord = {
    newPassWord: req.body.newPassWord,
    olPassWord : req.body.olPassWord
  }
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
      const { rows, rowCount } = await db.query("SELECT password FROM employeds WHERE id = $1 LIMIT 1;", [id]);
      if (rowCount != 1) {
        res.status(400).json({
          error : 'user not found'
        })
        return 
      }
      const oldPassword = CryptoJS.AES.decrypt(rows[0]?.password, String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8);
      const newPassWord = CryptoJS.AES.encrypt(password.newPassWord, String(process.env.ENC_PASS)).toString();
      if (oldPassword == password.olPassWord) {
        const user: IUser = {
          adress: {
            city: req.body?.city,
            cep: req.body?.cep,
            qoute: req.body?.qoute,
          },
          categoryId: req.body.categoryId,
          email: req.body.email,
          lastname: req.body.lastname,
          name: req.body.name,
          password: newPassWord,
        };
        
        if (isUser(user)) {
          const { rowCount } = await db.query("SELECT id from categoryEmployed WHERE id = $1 LIMIT 1", [user.categoryId]);
          if (rowCount == 1) {
              await db.query("UPDATE employeds SET password = $1 , name = $2 , lastname = $3 , email = $4 , adress = $5 , category_id = $6 , updated_at = now() WHERE id = $7;", [user.password, user.name , user.lastname , user.email , JSON.stringify(user.adress) ,  user.categoryId ,id]);
            res.status(200).json({
              msg: "updated",
            });
            return ;
          } else {
            res.status(400).json({
              msg: "invalid categoryId",
            });
            return ;
          }
          
        } else {
          res.status(400).json({
            msg: "invalid user",
          });
          return ;
        }
      
    } else {
      res.status(400).json({
        msg : 'password doesn´t matches!'
      })
      return 
    }
    } catch (error) {
    }
  }
}