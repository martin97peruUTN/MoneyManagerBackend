import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getAllTransactionCategoriesService(userId: number) {

    //It retrieves user owned and public transaction categories
    const transactionCategories = await prisma.transactionCategory.findMany({
        where: {
            OR: [
                {
                    userId: userId
                },
                {
                    public: true
                }
            ]
        }
    })
    return transactionCategories
}

async function getTransactionCategoryByIdService(transactionCategoryId: number) {
    const transactionCategory = await prisma.transactionCategory.findUnique({
        where: {
            id: transactionCategoryId
        }
    })
    return transactionCategory
}

async function createTransactionCategoryService(newTransactionCategory: Prisma.TransactionCategoryCreateInput) {
    const createdTransactionCategory = await prisma.transactionCategory.create({
        data: newTransactionCategory,
    });
    return createdTransactionCategory;
}

async function updateTransactionCategoryService(transactionCategoryData: Prisma.TransactionCategoryUpdateInput, id: number) {
    const transactionCategory = await prisma.transactionCategory.update({
        where: {
            id: id
        },
        data: transactionCategoryData
    })
    return transactionCategory
}

async function deleteTransactionCategoryService(id: number) {
    const transactionCategory = await prisma.transactionCategory.delete({
        where: {
            id: id
        }
    })
    return transactionCategory
}

export {
    getAllTransactionCategoriesService,
    getTransactionCategoryByIdService,
    createTransactionCategoryService,
    updateTransactionCategoryService,
    deleteTransactionCategoryService
}