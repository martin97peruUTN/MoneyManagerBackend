import { Prisma, PrismaClient, User, Account, Transfer, TransactionCategory, Transaction } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

const prisma = new PrismaClient()

async function getAllAccountsService(userId: number) {
    const accounts = await prisma.account.findMany({
        where: { userId: userId }
    })
    return accounts
}

async function getAccountByIdService(accountId: number) {
    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        }
    })
    return account
}

async function createAccountService(newAccount: Prisma.AccountCreateInput): Promise<Account> {
    const createdAccount = await prisma.account.create({
        data: newAccount,
    });
    return createdAccount;
}

async function updateAccountService(accountData: Prisma.AccountUpdateInput, id: number) {
    const account = await prisma.account.update({
        where: {
            id: id
        },
        data: accountData
    })
    return account
}

async function deleteAccountService(id: number) {
    const account = await prisma.account.delete({
        where: {
            id: id
        }
    })
    return account
}

export {
    getAllAccountsService,
    getAccountByIdService,
    createAccountService,
    updateAccountService,
    deleteAccountService
}