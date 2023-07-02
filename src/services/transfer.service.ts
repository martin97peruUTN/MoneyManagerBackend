import { Prisma, PrismaClient, Transfer } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllTransfersByUserService(userId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            OR: {
                originAccount: {
                    userId: userId
                },
                destinyAccount: {
                    userId: userId
                }
            }
        }
    });
    return transfers
}

//Unused
async function getAllOriginTransfersByUserService(userId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            originAccount: {
                userId: userId
            }
        }
    });
    return transfers
}

//Unused
async function getAllDestinyTransfersByUserService(userId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            destinyAccount: {
                userId: userId
            }
        }
    });
    return transfers
}

async function getAllTransfersByAccountIdService(userId: number, accountId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            OR: [
                {
                    originAccount: {
                        id: accountId,
                        userId: userId
                    }
                },
                {
                    destinyAccount: {
                        id: accountId,
                        userId: userId
                    }
                }
            ]
        }
    });
    return transfers
}

async function getAllOriginTransfersByAccountIdService(userId: number, accountId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            originAccount: {
                id: accountId,
                userId: userId
            }
        }
    });
    return transfers
}

async function getAllDestinyTransfersByAccountIdService(userId: number, accountId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            destinyAccount: {
                id: accountId,
                userId: userId
            }
        }
    });
    return transfers
}

async function getTransferByIdService(transferId: number) {
    const transfer = await prisma.transfer.findUnique({
        where: {
            id: transferId
        },
        include: {
            originAccount: {
                select: {
                    userId: true
                }
            },
            destinyAccount: {
                select: {
                    userId: true
                }
            }
        }
    })
    return transfer
}

async function createTransferService(newTransfer: Prisma.TransferCreateInput): Promise<Transfer> {
    const createdTransfer = await prisma.transfer.create({
        data: newTransfer,
    });
    return createdTransfer;
}

async function updateTransferService(transferData: Prisma.TransferUpdateInput, id: number) {
    const transfer = await prisma.transfer.update({
        where: {
            id: id
        },
        data: transferData
    })
    return transfer
}

async function deleteTransferService(id: number) {
    const transfer = await prisma.transfer.delete({
        where: {
            id: id
        }
    })
    return transfer
}

export {
    getAllTransfersByUserService,
    getAllOriginTransfersByUserService,
    getAllDestinyTransfersByUserService,
    getAllTransfersByAccountIdService,
    getAllOriginTransfersByAccountIdService,
    getAllDestinyTransfersByAccountIdService,
    getTransferByIdService,
    createTransferService,
    updateTransferService,
    deleteTransferService
}