import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'
dotenv.config()


export default function verifyToken( req : Request , res : Response , next : NextFunction) {
    const token = String(req.headers['authorization'])
    if(!token || token.length == 0){
        res.status(401).json({
            error: "empty token",
        });
        return;
    }
    try {
        jwt.verify(token, String(process.env.JWT), (err, payload) => {
            if (err) {
                res.status(401).json({
                    error : 'invalid token'
                })
                return
            } else {
                next()
                return
            }
        });
    } catch (error) {
    }
}

export function generateToken(payload : any) {
    try {
        const token = jwt.sign(payload, String(process.env.JWT))
        return token
    } catch (error) {
        return false
    }
}

export function isAdminToken(req: Request, res: Response, next: NextFunction) {
    
    const token = String(req.headers['authorization'])
    if(!token || token.length == 0){
        res.status(401).json({
            error: "empty admin token",
        });
        return;
    }
    try {
        jwt.verify(token, String(process.env.JWT), (err, payload) => {
            if (err) {
                res.status(401).json({
                    error : 'must be admin token'
                })
                return
            }
            else if(payload?.isAdmin) {
                next()
                return
            } else {
                res.status(401).json({
                    error: "you´re admin",
                });
                return;
            }
        });
    } catch (error) {
         res.status(401).json({
           error: "must be admin token",
         });
         return;
    }
}