import { generateToken } from "../middlewares/jwt";
import { Request, Response } from "express";
import validator from 'validator'
import ConnectionDB from "../database/dbConnection";
import CryptoJS from "crypto-js";
const db = ConnectionDB;
export async function AdminLogin(req : Request , res : Response) {
    
    try {
        if (validator.isEmail(req.body?.email) && req.body?.password?.length >= 8) {
            
            db.query('SELECT email , password , id from delivery WHERE id = 1 LIMIT 1;', (err, result) => {
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