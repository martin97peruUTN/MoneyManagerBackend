import { Prisma, PrismaClient, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

const prisma = new PrismaClient()

async function getAllUsersService() {
    const users = await prisma.user.findMany()
    return users
}

async function getUserByIdService(id: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    return user
}

async function getUserByUsernameService(username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    return user
}

async function createUserService(newUser: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await prisma.user.create({
        data: newUser,
    });
    return createdUser;
}

async function updateUserService(userData: Prisma.UserUpdateInput, id: number) {
    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: userData
    })
    return user
}

async function deleteUserService(id: number) {
    const user = await prisma.user.delete({
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