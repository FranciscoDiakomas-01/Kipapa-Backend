import { IDelivery, IOrder } from "../types/types";
import {  Pool } from "pg";
export default async function isOrderAvaliale(order : IOrder , db : Pool) {
    try {
        //verificar se o valor totalPago é coerente
        let totalPay = 0
        order.orders_food?.forEach(food => {
            totalPay += (food.price * food.qtd)
        })
        if (totalPay != order.order_detais.total_Pay) {
            return false
        }
        else {
            //verificar se existe essa forma de pagamento
            const { rowCount } = await db.query("SELECT title  FROM payforms WHERE title = $1 LIMIT 1;", [order.order_detais.payForm?.toUpperCase()]);
            if (rowCount == 0) {
                return false
            } else {
                //<verificar se existe esse cliente
                const { rowCount } = await db.query("SELECT id  FROM clients WHERE id = $1 LIMIT 1;", [order.clientId]);
                if (rowCount == 0) {
                    return false
                } else {
                    return true
                }
            }
        }
    } catch (error) {
        
    }
}


export  async function isOrderUser(user : IDelivery , db : Pool) {
    try {
        //verificar se o usuario da entrega existe
        
        const { rowCount } = await db.query("SELECT id  FROM users WHERE email = $1 and id = $2 LIMIT 1;"[user.email, user.id]);
        if (rowCount == 0) {
                return false
        } else {
            return true
        }
        
    } catch (error) {
        return false
    }
}