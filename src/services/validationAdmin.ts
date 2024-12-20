import { IAdmin } from "../types/types";
import validator from 'validator'

export function isAvaliableAdmin(admin : IAdmin) {
    try {
        
        if (validator.isEmail(admin.email)) {
            return true
        } else {
            return false
        }
    } catch (error) {
            return false
    }
}