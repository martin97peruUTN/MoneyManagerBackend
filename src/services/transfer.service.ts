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

    const result = {
        originAccountUpdated: resultArray[0],
        destinyAccountUpdated: resultArray[1],
        transferCreated: resultArray[2]
    }

    return result
}

async function updateTransferService(currentOriginAccountId: number | null, currentDestinationAccountId: number | null, newOriginAccountId: number, newDestinationAccountId: number, transferId: number, currentAmount: number, currentDestinyAmount: number, newAmount: number, newDestinyAmount: number, comment: string, date: string) {
    return await prisma.$transaction(async (tx) => {
        let result: any = {}
        const differentOriginAccount = currentOriginAccountId !== newOriginAccountId
        const differentDestinationAccount = currentDestinationAccountId !== newDestinationAccountId

        if (differentOriginAccount) {
            //if there is an origin account, update it
            if (currentOriginAccountId !== undefined && currentOriginAccountId !== null) {
                result.oldOriginAccountUpdated = await tx.account.update({
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
            //I'm sure that there is a new origin account, so I update it
            result.newOriginAccountUpdated = await tx.account.update({
                where: {
                    id: newOriginAccountId
                },
                data: {
                    balance: {
                        decrement: newAmount
                    }
                }
            })
        } else {
            //I'm sure that there is a "new" origin account, so I update it, but because the origin account is the same, 
            //I have to update the balance with the difference between the current amount and the new amount
            result.originAccountUpdated = await tx.account.update({
                where: {
                    id: newOriginAccountId
                },
                data: {
                    balance: {
                        increment: currentAmount - newAmount
                    }
                }
            })
        }

        if (differentDestinationAccount) {
            //if there is a destination account, update it
            if (currentDestinationAccountId !== undefined && currentDestinationAccountId !== null) {
                result.oldDestinationAccountAccountUpdated = await tx.account.update({
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
            //I'm sure that there is a new destination account, so I update it
            result.newDestinationAccountUpdated = await tx.account.update({
                where: {
                    id: newDestinationAccountId
                },
                data: {
                    balance: {
                        increment: newDestinyAmount
                    }
                }
            })
        } else {
            //I'm sure that there is a "new" destination account, so I update it, but because the destination account is the same,
            //I have to update the balance with the difference between the current amount and the new amount
            result.destinationAccountUpdated = await tx.account.update({
                where: {
                    id: newDestinationAccountId
                },
                data: {
                    balance: {
                        decrement: currentDestinyAmount - newDestinyAmount
                    }
                }
            })
        }

        result.transferUpdated = await tx.transfer.update({
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

        return result
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

        const result = {
            originAccountUpdated: arrayResult[0],
            destinyAccountUpdated: arrayResult[1],
            transferDeleted: arrayResult[2]
        }

        return result
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