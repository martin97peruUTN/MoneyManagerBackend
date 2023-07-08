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

async function createTransferService(originAccountId: number, destinyAccountId: number, amount: number, comment: string, date: string) {
    const resultArray = await prisma.$transaction([
        prisma.account.update({
            where: {
                id: originAccountId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        }),
        prisma.account.update({
            where: {
                id: destinyAccountId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        }),
        prisma.transfer.create({
            data: {
                originAccount: {
                    connect: {
                        id: originAccountId
                    }
                },
                destinyAccount: {
                    connect: {
                        id: destinyAccountId
                    }
                },
                amount: amount,
                comment: comment,
                date: date
            }
        })
    ])
    return resultArray
}

async function updateTransferService(currentOriginAccountId: number, currentDestinationAccountId: number, newOriginAccountId: number, newDestinationAccountId: number, transferId: number, currentAmount: number, newAmount: number, comment: string, date: string) {
    //I use a transaction, so if one of the updates fails, the others will be rolled back
    const resultArray = await prisma.$transaction([
        prisma.account.update({
            where: {
                id: currentOriginAccountId
            },
            data: {
                balance: {
                    increment: currentAmount
                }
            }
        }),
        prisma.account.update({
            where: {
                id: currentDestinationAccountId
            },
            data: {
                balance: {
                    decrement: currentAmount
                }
            }
        }),
        prisma.account.update({
            where: {
                id: newOriginAccountId
            },
            data: {
                balance: {
                    decrement: newAmount
                }
            }
        }),
        prisma.account.update({
            where: {
                id: newDestinationAccountId
            },
            data: {
                balance: {
                    increment: newAmount
                }
            }
        }),
        prisma.transfer.update({
            where: {
                id: transferId
            },
            data: {
                originAccount: { connect: { id: newOriginAccountId } },
                destinyAccount: { connect: { id: newDestinationAccountId } },
                amount: newAmount,
                comment: comment,
                date: date
            }
        })
    ])
    return resultArray
}

async function deleteTransferService(id: number, originAccountId: number, destinyAccountId: number, amount: number) {
    const resultArray = await prisma.$transaction([
        prisma.account.update({
            where: {
                id: originAccountId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        }),
        prisma.account.update({
            where: {
                id: destinyAccountId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        }),
        prisma.transfer.delete({
            where: {
                id: id
            }
        })
    ])
    return resultArray
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