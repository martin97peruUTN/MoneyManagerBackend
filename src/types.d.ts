//Si meto enums aca tengo que sacarle el .d al archivo porque a eso lo transpilea a js

export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    lastname: string;
};

export type UserWithoutId = Omit<User, 'id'>;