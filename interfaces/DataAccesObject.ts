export interface StandardResponseDAO {
    status: number
    message: string
}

export interface AuthResponseDAO extends StandardResponseDAO {
    access_token: string;
    user: UserDAO;
}

export interface UserDAO {
    id: number;
    email: string;
    username: string;
    name: string;
    phone: string;
    address: string;
    birth_date: string;
    gender: string;
}

export interface GetProductsServiceDAO extends StandardResponseDAO {
    data: ProductDAO[]
}

export interface ProductDAO {
    id_product: number
    title: string
    value: number
    description: string
    stock: number
    state_id: number
}