import { generateToken } from "../middlewares/jwt";
import { Request, Response } from "express";
import validator from 'validator'
import ConnectionDB from "../database/dbConnection";
import CryptoJS from "crypto-js";
const db = ConnectionDB;
export async function AdminLogin(req : Request , res : Response) {
    
    try {
        if (validator.isEmail(req.body?.email) && req.body?.password?.length >= 8) {
            
            await db.query('SELECT email , password , id from delivery WHERE id = 1 LIMIT 1;', (err, result) => {
                if (err) {
                    console.log(err)
                    return
                } else {
                    const decryptedPass = CryptoJS.AES.decrypt(result.rows[0]?.password ,String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8)
                    if (req.body?.email == result.rows[0]?.email && req.body?.password == decryptedPass) {
                        const payload = {
                            email: result.rows[0]?.email,
                            id: result.rows[0]?.id,
                            isAdmin : true
                        }
                        const token = generateToken(payload)
                        res.status(200).json({
                            token: token,
                            login : 'sucess'
                        })
                        return 
                    } else {
                        res.status(401).json({
                            error : 'your not admin'
                        })
                        return 
                    }
                }
            })
        } else {
            res.status(400).json({
                error : 'invalid email or password'
            })
            return
        }
    } catch (error) {
        res.status(400).json({
            error : 'invalid body'
        })
    }
}


export async function ClientLogin(req: Request, res: Response) {
  try {
    if (validator.isEmail(req.body?.email) && req.body?.password?.length >= 8) {
      await db.query(
        "SELECT email , password , id from clients WHERE email = $1 LIMIT 1;", [req.body.email],
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          } else {
              if (result.rowCount == 0) {
                  res.status(404).json({
                      msg : 'client not found'
                  })
                  return
              }
            const decryptedPass = CryptoJS.AES.decrypt(result.rows[0]?.password,String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8);
            if (req.body?.email == result.rows[0]?.email && req.body?.password == decryptedPass) {
              const payload = {
                id: result.rows[0]?.id,
              };
              const token = generateToken(payload);
              res.status(200).json({
                token: token,
                login: "sucess",
                id : payload.id
              });
              return;
            } else {
              res.status(401).json({
                error: "your not admin",
              });
              return;
            }
          }
        }
      );
    } else {
      res.status(400).json({
        error: "invalid email or password",
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      error: "invalid body",
    });
  }
}