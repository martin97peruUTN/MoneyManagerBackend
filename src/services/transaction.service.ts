import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllTransactionsService(userId: number) {
    const transactionsResult = await prisma.transaction.findMany({
        where: {
            account: {
                userId: userId
            }
        }
    });

    return transactionsResult
}

async function getTransactionByIdService(transactionId: number, userId: number) {
    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            account: {
                userId: userId,
            },
        },
    });

    return transaction
}

async function createTransactionService(amount: number, comment: string, date: Date, accountId: number, transactionCategoryId: number, isExpense: boolean) {
    return await prisma.$transaction(async (tx) => {
        let result: any = {}

        //Update account balance, if it is an expense, decrement, if it is an income, increment
        if (isExpense) {
            result.accountUpdated = await tx.account.update({
                where: {
                    id: accountId
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })
        } else {
            result.accountUpdated = await tx.account.update({
                where: {
                    id: accountId
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            })
        }

        result.transaction = await tx.transaction.create({
            data: {
                amount: amount,
                comment: comment,
                date: date,
                accountId: accountId,
                transactionCategoryId: transactionCategoryId
            }
        })

        return result
    })
}

async function updateTransactionService(transactionData: Prisma.TransactionUpdateInput, id: number) {
    const transaction = await prisma.transaction.update({
        where: {
            id: id
        },
        data: transactionData
    })
    return transaction
}

async function deleteTransactionService(id: number) {
    const transaction = await prisma.transaction.delete({
        where: {
            id: id
        }
    })
    return transaction
}

export {
    getAllTransactionsService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService
}