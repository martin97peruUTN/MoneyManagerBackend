import { Prisma, PrismaClient, Currency } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

const prisma = new PrismaClient()

async function getAllCurrenciesService() {
    const accounts = await prisma.currency.findMany()
    return accounts
}

async function getCurrencyByIdService(currencyId: number) {
    const account = await prisma.currency.findUnique({
        where: {
            id: currencyId
        }
    })
    return account
}

async function createCurrencyService(newCurrency: Prisma.CurrencyCreateInput) {
    const createdCurrency = await prisma.currency.create({
        data: newCurrency,
    });
    return createdCurrency;
}

async function updateCurrencyService(currencyData: Prisma.CurrencyUpdateInput, id: number) {
    const currency = await prisma.currency.update({
        where: {
            id: id
        },
        data: currencyData
    })
    return currency
}

async function deleteCurrencyService(id: number) {
    const currency = await prisma.currency.delete({
        where: {
            id: id
        }
    })
    return currency
}

export {
    getAllCurrenciesService,
    getCurrencyByIdService,
    createCurrencyService,
    updateCurrencyService,
    deleteCurrencyService
}