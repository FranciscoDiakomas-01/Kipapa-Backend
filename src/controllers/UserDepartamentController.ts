import { Response , Request } from "express";
import ConnectionDB from "../database/dbConnection";
import dotenv from 'dotenv'
dotenv.config()
import { IDepartament } from './../types/types';
const db = ConnectionDB;

export async function getUserDepartament(req : Request , res : Response) {
    
    const id = Number(req.query.id);
    if (id) {
        db.query("SELECT * FROM categoryEmployed WHERE id = $1;" , [id], async(err, result) => {
            res.status(200).json({
                data: result.rows,
            });
            return ;
        });
        return
    }
    db.query("SELECT * FROM categoryEmployed;", async(err, result) => {
        res.status(200).json({
            data: result.rows,
            total: result.rowCount,
        });
        return ;
    });
}

export async function CreateUserDepartament(req: Request, res: Response) {
    ;
    const departament: IDepartament = {
        salary: req.body.salary,
        title: req.body.title
    }
    if (departament.salary > 1000 && departament.title.length > 2 ) {
        db.query("INSERT INTO categoryEmployed(salary ,title) VALUES($1 , $2)", [departament.salary, departament.title], async(err, result) => {
            if (err) {
                res.status(400).json({
                    error : 'alreary exist',
                });
                return 
            } else {
                res.status(201).json({
                    data: 'created',
                });
                return ;
            }
        });
        
    } else {
        res.status(400).json({
            error : 'inavlid body'
        })
        return 
    }
}

export async function UpdateUserDepartament(req : Request , res : Response) {
    const id = Number(req.params.id)
    
    const departament: IDepartament = {
        salary: req.body.salary,
        title: req.body.title
    }
    if (departament.salary > 1000 && departament.title.length > 2 ) {
        db.query("UPDATE categoryEmployed SET salary = $1 ,title = $2 , updated_at = now() WHERE id = $3",[departament.salary, departament.title, id], async(err, result) => {
            if (err) {
                res.status(400).json({
                    error : 'alreary exist',
                });
                return ;
            } else {
                res.status(201).json({
                    data:  result.rowCount != 0 ? 'updated' : 'not found',
                });
                return ;
            }
        });
    } else {
        res.status(400).json({
            error : 'inavlid body'
        })
        return ;
    }
}

export async function DeleteuserDepartment(req : Request , res : Response) {
    const id = Number(req.params.id);
    ;
    if (!isNaN(id)) {
        db.query("DELETE FROM categoryEmployed WHERE id = $1;",[id], async(err, result) => {
            res.status(201).json({
                    data:  result.rowCount != 0 ? 'deleted' : 'not found',
            });
            return 
        });
    } else {
        res.status(400).json({
            error : 'inavlid id'
        })
        return 
    }
}
