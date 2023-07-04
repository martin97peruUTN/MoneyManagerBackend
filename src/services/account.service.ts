import { Prisma, PrismaClient, Account } from '@prisma/client'

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

async function getMultipleAccountByIdsService(accountIds: number[]) {
    //IMPORTANT: Returns and array of the same length as the input array

    const uniqueAccountIds = [...new Set(accountIds)]; // Remove duplicate accountIds

    const accounts = await prisma.account.findMany({
        where: {
            id: {
                in: uniqueAccountIds
            }
        }
    });

    // Create a map of accountId to its corresponding account object
    const accountMap = new Map<number, Account>();
    accounts.forEach((account) => {
        accountMap.set(account.id, account);
    });

    // Create the result array with repeated accounts based on the original accountIds array
    const result = accountIds.map((accountId) => accountMap.get(accountId));

    return result;
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
    getMultipleAccountByIdsService,
    createAccountService,
    updateAccountService,
    deleteAccountService
}