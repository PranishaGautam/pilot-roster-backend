export interface UserRole {
    role: 'admin' | 'pilot';
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole["role"];
    start_date: Date;
    end_date: Date;
}

export interface GetUserParams {
    id: string;
}

export interface RegisterRequestBody {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: UserRole["role"];
}

export interface RegisterResponseBody {
    id: number;
    email: string;
    role: UserRole["role"];
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: UserRole["role"];
}