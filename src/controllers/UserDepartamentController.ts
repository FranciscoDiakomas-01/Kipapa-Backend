import { Response , Request } from "express";
import ConnectionDB from "../database/dbConnection";
import dotenv from 'dotenv'
dotenv.config()
import { IDepartament } from './../types/types';

export async function getUserDepartament(req : Request , res : Response) {
    const db = await ConnectionDB()
    const id = Number(req.query.id);
    if (id) {
        db.query("SELECT * FROM categoryEmployed WHERE id = $1;" , [id], async(err, result) => {
            res.status(200).json({
                data: result.rows,
            });
            return await db.end();
        });
        return
    }
    db.query("SELECT * FROM categoryEmployed;", async(err, result) => {
        res.status(200).json({
            data: result.rows,
            total: result.rowCount,
        });
        return await db.end();
    });
}

export async function CreateUserDepartament(req: Request, res: Response) {
    const db = await ConnectionDB();
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
                return await db.end()
            } else {
                res.status(201).json({
                    data: 'created',
                });
                return await db.end();
            }
        });
        
    } else {
        res.status(400).json({
            error : 'inavlid body'
        })
        return await db.end()
    }
}

export async function UpdateUserDepartament(req : Request , res : Response) {
    const id = Number(req.params.id)
    const db = await ConnectionDB()
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
                return await db.end();
            } else {
                res.status(201).json({
                    data:  result.rowCount != 0 ? 'updated' : 'not found',
                });
                return await db.end();
            }
        });
    } else {
        res.status(400).json({
            error : 'inavlid body'
        })
        return await db.end();
    }
}

export async function DeleteuserDepartment(req : Request , res : Response) {
    const id = Number(req.params.id);
    const db = await ConnectionDB();
    if (!isNaN(id)) {
        db.query("DELETE FROM categoryEmployed WHERE id = $1;",[id], async(err, result) => {
            res.status(201).json({
                    data:  result.rowCount != 0 ? 'deleted' : 'not found',
            });
            return await db.end()
        });
    } else {
        res.status(400).json({
            error : 'inavlid id'
        })
        return await db.end()
    }
}
