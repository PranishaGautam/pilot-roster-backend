export interface User {
    id: number;
    first_name: string;
    last_name: string
    role: string;
    email: string;
    start_date: Date;
    end_date: Date;
    password: string;
}