import { Prisma, Users } from '@/generated/prisma'
import prisma from '../prisma'

/** User shape safe to return from APIs (excludes password hash). */
export type PublicUser = Omit<Users, 'password'>

function omitPassword(user: Users): PublicUser {
    const { password: _password, ...rest } = user
    return rest
}

async function getAllUsersService(): Promise<PublicUser[]> {
    const users = await prisma.users.findMany()
    return users.map(omitPassword)
}

async function getUserByIdService(id: number): Promise<PublicUser | null> {
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    return user ? omitPassword(user) : null
}

/** Includes password — only for auth flows (e.g. login). */
async function getUserByUsernameService(username: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    })
    return user
}

async function createUserService(newUser: Prisma.UsersCreateInput): Promise<PublicUser> {
    const createdUser = await prisma.users.create({
        data: newUser,
    })
    return omitPassword(createdUser)
}

async function updateUserService(
    userData: Prisma.UsersUpdateInput,
    id: number
): Promise<PublicUser> {
    const user = await prisma.users.update({
        where: {
            id: id
        },
        data: userData
    })
    return omitPassword(user)
}

async function deleteUserService(id: number): Promise<PublicUser> {
    const user = await prisma.users.delete({
        where: {
            id: id
        }
    })
    return omitPassword(user)
}

export {
    getAllUsersService,
    getUserByIdService,
    getUserByUsernameService,
    createUserService,
    updateUserService,
    deleteUserService
}