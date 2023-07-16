import { Prisma, PrismaClient, Transfer } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllTransfersByUserService(userId: number) {
    const transfers = await prisma.transfer.findMany({
        where: {
            OR: [
                {
                    originAccount: {
                        userId: userId
                    }
                },
                {
                    destinyAccount: {
                        userId: userId
                    }
                }
            ]
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

async function createTransferService(originAccountId: number, destinyAccountId: number, amount: number, destinyAmount: number, comment: string, date: string) {
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
                    increment: destinyAmount
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
                destinyAmount: destinyAmount,
                comment: comment,
                date: date
            }
        })
    ])
    return resultArray
}

async function updateTransferService(currentOriginAccountId: number | null, currentDestinationAccountId: number | null, newOriginAccountId: number, newDestinationAccountId: number, transferId: number, currentAmount: number, currentDestinyAmount: number, newAmount: number, newDestinyAmount: number, comment: string, date: string) {
    return await prisma.$transaction(async (tx) => {
        let arrayResult = []
        //if there is an origin account, update it
        if (currentOriginAccountId !== undefined && currentOriginAccountId !== null) {
            arrayResult[0] = await tx.account.update({
                where: {
                    id: currentOriginAccountId
                },
                data: {
                    balance: {
                        increment: currentAmount
                    }
                }
            })
        }
        //if there is a destination account, update it
        if (currentDestinationAccountId !== undefined && currentDestinationAccountId !== null) {
            arrayResult[1] = await tx.account.update({
                where: {
                    id: currentDestinationAccountId
                },
                data: {
                    balance: {
                        decrement: currentDestinyAmount
                    }
                }
            })
        }

        //I'm sure that there is a new origin and a new destination account, so I update them
        arrayResult[2] = await tx.account.update({
            where: {
                id: newOriginAccountId
            },
            data: {
                balance: {
                    decrement: newAmount
                }
            }
        })

        arrayResult[3] = await tx.account.update({
            where: {
                id: newDestinationAccountId
            },
            data: {
                balance: {
                    increment: newDestinyAmount
                }
            }
        })

        arrayResult[4] = await tx.transfer.update({
            where: {
                id: transferId
            },
            data: {
                originAccount: { connect: { id: newOriginAccountId } },
                destinyAccount: { connect: { id: newDestinationAccountId } },
                amount: newAmount,
                destinyAmount: newDestinyAmount,
                comment: comment,
                date: date
            }
        })

        return arrayResult
    })
}

async function deleteTransferService(id: number, originAccountId: number | null, destinyAccountId: number | null, amount: number, destinyAmount: number) {
    return await prisma.$transaction(async (tx) => {
        let arrayResult = []
        //if there is an origin account, update it
        if (originAccountId !== undefined && originAccountId !== null) {
            arrayResult[0] = await tx.account.update({
                where: {
                    id: originAccountId
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
        }
        //if there is a destination account, update it
        if (destinyAccountId !== undefined && destinyAccountId !== null) {
            arrayResult[1] = await tx.account.update({
                where: {
                    id: destinyAccountId
                },
                data: {
                    balance: {
                        decrement: destinyAmount
                    }
                }
            })
        }

        arrayResult[2] = await tx.transfer.delete({
            where: {
                id: id
            }
        })

        return arrayResult
    })
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