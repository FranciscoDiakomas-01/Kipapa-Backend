import { IUser } from "../types/types";
import validator from 'validator'


export default function isUser(user: IUser) {
    if (validator.isEmail(user.email) && !isNaN(user.categoryId) && String(user.adress.cep).length >= 12 && user.adress.city?.length >= 3 && user.adress.qoute?.length >= 4 && user.name?.length >= 2 && user.lastname?.length >= 2 && user.name?.length >= 2
    ) {
        return true;
    } else {
        return false;
    }
}

export  function isClient(user : Omit<IUser , 'categoryId'>) {
    if (validator.isEmail(user.email)  &&!isNaN(user.adress.cep) &&user.adress.city?.length >= 5 &&user.adress.qoute?.length >= 4 &&user.name?.length >= 2 &&user.lastname?.length >= 2 &&user.name?.length >= 2) {
        return true;
    } else {
        return false;
    }
}