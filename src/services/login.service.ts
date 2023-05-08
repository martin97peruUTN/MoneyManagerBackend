// const users = [
//     {
//         username: 'martin97peru',
//         password: 'test123'
//     },
//     {
//         username: 'martin97peru2',
//         password: 'test456'
//     }
// ];

import { getUserByUsernameService } from './user.service'

export const jwtLoginService = async (username: string) => {
    const user = await getUserByUsernameService(username)
    return user
}

export const homepageService = () => {
    return "Homepage"
}