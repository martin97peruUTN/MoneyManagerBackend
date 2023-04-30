import { UserWithoutId } from "../types";

const isString = (text: any): boolean => {
    return typeof text === 'string' || text instanceof String
}

const parseString = (myString: any): string => {
    if (!isString(myString)) {
        throw new Error('Incorrect or missing string: ' + myString)
    }
    return myString
}

export const toUserWithoutId = (object: any): UserWithoutId => {
    const newUser: UserWithoutId = {
        username: parseString(object.username),
        password: parseString(object.password),
        name: parseString(object.name),
        lastname: parseString(object.lastname)
    }
    return newUser
}


