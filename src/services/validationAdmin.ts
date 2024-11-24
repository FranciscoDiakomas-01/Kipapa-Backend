import { IAdmin } from "../types/types";
import validator from 'validator'

export function isAvaliableAdmin(admin : IAdmin) {
    try {
        
        if (validator.isEmail(admin.email) && admin.name?.length >= 4 && !isNaN(admin.adress.cep) && admin.adress.city?.length > 4 && admin.adress.qoute?.length >0) {
            return true
        } else {
            return false
        }
    } catch (error) {
            return false
    }
}