import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllTransactionsService(userId: number, dateFrom: Date, dateTo: Date) {
    const transactionsResult = await prisma.transaction.findMany({
        where: {
            account: {
                userId: userId
            },
            date: {
                gte: dateFrom,
                lte: dateTo
            }
        }
    });

    return transactionsResult
}

async function getAllTransactionsExpensesService(userId: number, dateFrom: Date, dateTo: Date) {
    const transactionsResult = await prisma.transaction.findMany({
        where: {
            account: {
                userId: userId
            },
            transactionCategory: {
                isExpense: true
            },
            date: {
                gte: dateFrom,
                lte: dateTo
            }
        }
    });

    return transactionsResult
}

async function getAllTransactionsIncomesService(userId: number, dateFrom: Date, dateTo: Date) {
    const transactionsResult = await prisma.transaction.findMany({
        where: {
            account: {
                userId: userId
            },
            transactionCategory: {
                isExpense: false
            },
            date: {
                gte: dateFrom,
                lte: dateTo
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

async function updateTransactionService(transactionId: number, currentAccountId: number | null, newAccountId: number,
    oldTransactionCategoryIsExpense: boolean, newTransactionCategoryId: number, newTransactionCategoryIsExpense: boolean,
    oldAmount: number, newAmount: number, comment: string, date: Date) {
    return await prisma.$transaction(async (tx) => {

        let result: any = {}

        const differentAccount = currentAccountId !== newAccountId

        if (differentAccount) {
            //Return old account balance
            if (currentAccountId !== null) {
                if (oldTransactionCategoryIsExpense) {
                    result.oldAccountUpdated = await tx.account.update({
                        where: {
                            id: currentAccountId
                        },
                        data: {
                            balance: {
                                increment: oldAmount
                            }
                        }
                    })
                } else {
                    result.oldAccountUpdated = await tx.account.update({
                        where: {
                            id: currentAccountId
                        },
                        data: {
                            balance: {
                                decrement: oldAmount
                            }
                        }
                    })
                }
            }
            //Update new account balance
            if (newTransactionCategoryIsExpense) {
                result.newAccountUpdated = await tx.account.update({
                    where: {
                        id: newAccountId
                    },
                    data: {
                        balance: {
                            decrement: newAmount
                        }
                    }
                })
            } else {
                result.newAccountUpdated = await tx.account.update({
                    where: {
                        id: newAccountId
                    },
                    data: {
                        balance: {
                            increment: newAmount
                        }
                    }
                })
            }
        } else {//same account
            if (oldTransactionCategoryIsExpense && newTransactionCategoryIsExpense) {
                result.accountUpdated = await tx.account.update({
                    where: {
                        id: currentAccountId
                    },
                    data: {
                        balance: {
                            increment: oldAmount - newAmount
                        }
                    }
                })
            } else if (oldTransactionCategoryIsExpense && !newTransactionCategoryIsExpense) {
                result.accountUpdated = await tx.account.update({
                    where: {
                        id: currentAccountId
                    },
                    data: {
                        balance: {
                            increment: oldAmount + newAmount
                        }
                    }
                })
            } else if (!oldTransactionCategoryIsExpense && newTransactionCategoryIsExpense) {
                result.accountUpdated = await tx.account.update({
                    where: {
                        id: currentAccountId
                    },
                    data: {
                        balance: {
                            decrement: oldAmount + newAmount
                        }
                    }
                })
            } else {//!oldTransactionCategoryIsExpense && !newTransactionCategoryIsExpense
                result.accountUpdated = await tx.account.update({
                    where: {
                        id: currentAccountId
                    },
                    data: {
                        balance: {
                            decrement: oldAmount - newAmount
                        }
                    }
                })
            }
        }

        //Update transaction
        result.transaction = await tx.transaction.update({
            where: {
                id: transactionId
            },
            data: {
                amount: newAmount,
                comment,
                date,
                accountId: newAccountId,
                transactionCategoryId: newTransactionCategoryId
            }
        })

        return result
    })
}

async function deleteTransactionService(transactionId: number, accountId: number | null, isExpense: boolean, amount: number) {
    return await prisma.$transaction(async (tx) => {

        let result: any = {}

        if (accountId !== null) {
            if (isExpense) {
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
            } else {
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
            }
        }

        result.transaction = await tx.transaction.delete({
            where: {
                id: transactionId
            }
        })

        return result
    })
}

export {
    getAllTransactionsService,
    getAllTransactionsExpensesService,
    getAllTransactionsIncomesService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService
}