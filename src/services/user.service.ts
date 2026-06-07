import { Prisma, User } from '@/generated/prisma'
import prisma from '../prisma'

/** User shape safe to return from APIs (excludes auth-internal fields). */
export type PublicUser = Pick<
    User,
    'id' | 'name' | 'lastname' | 'email' | 'role'
>

const publicSelect = {
    id: true,
    name: true,
    lastname: true,
    email: true,
    role: true,
} satisfies Prisma.UserSelect

async function getAllUsersService(): Promise<PublicUser[]> {
    return prisma.user.findMany({ select: publicSelect })
}

async function getUserByIdService(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { id },
        select: publicSelect,
    })
}

export {
    getAllUsersService,
    getUserByIdService,
}
