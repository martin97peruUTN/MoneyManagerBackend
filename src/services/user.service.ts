import { Prisma, Users } from '@prisma/client'
import prisma from '../prisma'

async function getAllUsersService() {
    const users = await prisma.users.findMany()
    return users
}

async function getUserByIdService(id: number) {
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    return user
}

async function getUserByUsernameService(username: string) {
    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    })
    return user
}

async function createUserService(newUser: Prisma.UsersCreateInput): Promise<Users> {
    const createdUser = await prisma.users.create({
        data: newUser,
    });
    return createdUser;
}

async function updateUserService(userData: Prisma.UsersUpdateInput, id: number) {
    const user = await prisma.users.update({
        where: {
            id: id
        },
        data: userData
    })
    return user
}

async function deleteUserService(id: number) {
    const user = await prisma.users.delete({
        where: {
            id: id
        }
    })
    return user
}

export {
    getAllUsersService,
    getUserByIdService,
    getUserByUsernameService,
    createUserService,
    updateUserService,
    deleteUserService
}