

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  adress: IAdress;
  olPassWord : string
}
export  interface IAdress {
  cep: number;
  city: string;
  qoute: string;
}

export  interface IUser {
    name: string;
    lastname : string,
    categoryId : number;
    email: string;
    password: any;
    adress: IAdress;
}


export interface IDepartament {
  title: string;
  salary: number;
}


export interface IProductCategory {
  title: string,
  image_url: string,
  decription : string,
}
export interface IProduct {
  name: string;
  description: string;
  img_url: string;
  current_price: number;
  old_price: number;
  category_id: number,
}

export interface IOrder {
  delivery?: IDelivery;
  order_detais: IOrderDetails;
  status: number;
  adress: IAdress;
  orders_food: IFoodOrder[];
  clientId: number 
}

export interface IFoodOrder {
  name: string,
  qtd: number,
  price : number
}

export interface IDelivery {
  name: string;
  email: string;
}
export interface IOrderDetails {
  totalPoduct: number;
  total_Pay: number ;
  payForm: string;
}