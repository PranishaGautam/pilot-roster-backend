export interface UserRole {
    role: 'admin' | 'pilot';
}

export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    userEmail: string;
    userPassword: string;
    userRole: UserRole["role"];
    startDate: Date;
    endDate: Date;
}

export interface GetUserParams {
    id: string;
}

export interface RegisterRequestBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
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