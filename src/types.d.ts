export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    lastname: string;
};

export type UserWithoutId = Omit<User, 'id'>;