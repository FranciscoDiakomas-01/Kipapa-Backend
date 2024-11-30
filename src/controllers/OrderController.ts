import { Request, Response } from "express";
import ConnectionDB from "../database/dbConnection";
import {IOrder } from "../types/types";
import isOrderAvaliale from "../services/OrderValiatin";
const db = ConnectionDB;

export async function getOrderByID(req: Request, res: Response) {
  const orderId = Number(req.params.orderId)
    ? Number(req.params.orderId)
    : false;
  if (!orderId) {
    res.status(400).json({
      error: "invalid orderId",
    });
    return ;
  } else {
    db.query(
      "SELECT id , orders_food , delivery , status , adress , clientid ,order_detais , to_char(created_at , 'DD/MM/YYY - HH:mi') as created_at ,  to_char(updated_at , 'DD/MM/YYY - HH:mi') as updated_at FROM orders WHERE id = $1",[orderId],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        res.status(200).json({
          data: result.rows,
        });
      }
    );
  }
}

export async function getAllOrders(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query(
      "SELECT id from orders");
    const latPage = Math.ceil(Number(rowCount) / limit);
    db.query(
      "SELECT id , status , clientid ,  to_char(created_at , 'DD/MM/YYY - HH:mi') as created_at  FROM orders ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        res.status(200).json({
          data: result.rows,
          page,
          latPage,
          limit,
          total: rowCount,
        });
      }
    );
  }
export async function getAllOrderByStatus(req: Request, res: Response) {
  const status = Number(req.params.status) ? Number(req.params.status) : 1;
  if (!status) {
    res.status(400).json({
      error: "invalid status",
    });
    return ;
  } else {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query(
      "SELECT id from orders WHERE status = $1",
      [status]
    );
    const latPage = Math.ceil(Number(rowCount) / limit);
    db.query(
      "SELECT id , orders_food , delivery , status , adress , clientid ,order_detais , to_char(created_at , 'DD/MM/YYY - HH:mi') as created_at ,  to_char(updated_at , 'DD/MM/YYY - HH:mi') as updated_at FROM orders WHERE status = $1 ORDER BY id DESC LIMIT $2 OFFSET $3",
      [status, limit, offset],
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        res.status(200).json({
          data: result.rows,
          page,
          latPage,
          limit,
          total: rowCount,
        });
      }
    );
  }
}

export async function CreateOrder(req: Request, res: Response) {
  const order: IOrder = {
    adress: {
      cep: req.body.cep,
      city: req.body.city,
      qoute: req.body.qoute,
    },
    clientId: req.body.clientId,
    order_detais: req.body.order_detais,
    status: 1,
    orders_food: req.body.orders_food,
  };
  const validation = await isOrderAvaliale(order, db);

  if (!validation) {
    res.status(400).json({
      error: "invalid order",
    });
    return ;
  } else {
    db.query(
      "INSERT INTO orders(orders_food , adress , clientid , order_detais) VALUES ($1 , $2 , $3 , $4)",
      [
        JSON.stringify(order.orders_food),
        JSON.stringify(order.adress),
        order.clientId,
        JSON.stringify(order.order_detais),
      ],
      (err, result) => {
        if (err) {
          console.log(err.message);
        }
        res.status(200).json({
          error: "created",
        });
        return ;
      }
    );
  }
}

export async function UpdateStatusOrder(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  const status = Number(req.params.status);
  enum OrderStatus {
    processing = 1,
    completed = 3,
    canceled = 4,
    delivery = 2,
  }
  if (isNaN(orderId)) {
    res.status(400).json({
      error: "invalid id",
    });
    return;
  }
  if (status in OrderStatus) {

    db.query(
      "UPDATE orders SET status = $1 WHERE id = $2",
      [status, orderId],
      (err, result) => {
        res.status(200).json({
          data: result.rowCount != 0 ? "updated" : "not found",
        });
        return ;
      }
    );
  } else {
    res.status(400).json({
      error: "invalid status",
    });
    return;
  }
}

export async function deleteOrder(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({
      error: "invalid orederId",
    });
  }
  db.query("DELETE  FROM orders WHERE id = $1", [orderId], (err, result) => {
    res.status(200).json({
      error: result.rowCount != 0 ? "deleted" : "not found",
    });
    return ;
  });
}


export async function AddDelivery(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  const userId = Number(req.params.userId);
  //getUserById or Delivery
  const { rowCount, rows } = await db.query(
    "SELECT name , id , email FROM employeds where id=$1 LIMIT 1",
    [userId]
  );
  if (isNaN(orderId) || isNaN(userId)) {
    res.status(400).json({
      error: "invalid id",
    });
    return;
  }
  if (rowCount != 0) {
    db.query(
      "UPDATE orders SET delivery = $1 WHERE id = $2",
      [JSON.stringify(rows[0]), orderId],
      (err, result) => {
        res.status(200).json({
          data: result.rowCount != 0 ? "updated" : "not found",
        });
        return;
      }
    );
  } else {
    res.status(400).json({
      error: "invalid user",
    });
    return;
  }
}