import { getUserByUsernameService } from './user.service'

export const jwtLoginService = async (username: string) => {
    const user = await getUserByUsernameService(username)
    return user
}