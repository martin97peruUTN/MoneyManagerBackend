export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    lastname: string;
};

export type NewUser = Omit<User, 'id'>;