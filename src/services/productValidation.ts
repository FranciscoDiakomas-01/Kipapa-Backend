import { IProduct } from "../types/types";
import { Client } from "pg";

export async function isProduct(product : IProduct , db : Client) {
    
    //validar os dados de um produto
    const { rowCount } = await db.query("SELECT id from productCategory WHERE id = $1 LIMIT 1;", [product?.category_id]);
    if (rowCount != 0) {
        
        if (!isNaN(product?.old_price) && !isNaN(product?.current_price)   && product?.current_price > 100 && product?.name?.length >= 2 && product?.description?.length > 5 && product.img_url) {
            return true
        } else {
            return  false
        }
    } else {
        db.end()
        return false
    }
}

export async function isProductToUpdate(product : Omit<IProduct , 'img_url'> , db : Client) {
    
    //validar os dados de um produto a ser actualizado
    try {
        const { rowCount } = await db.query("SELECT id from productCategory WHERE id = $1 LIMIT 1;", [product?.category_id]);
    if (rowCount != 0) {
        if (!isNaN(product?.old_price) && product?.current_price > 100 && !isNaN(product?.current_price) && product?.name?.length >= 2 && product?.description?.length > 5) {
            return true
        } else {
            return  false
        }
    } else {
        return false
    }
    } catch (error) {
        return false
    }
    
}