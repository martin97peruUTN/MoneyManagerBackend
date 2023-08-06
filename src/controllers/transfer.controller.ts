import { Request, Response } from 'express';

import { Prisma } from '@prisma/client'

import * as miscFunctions from '../utils/miscFunctions'

import {
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
} from '../services/transfer.service';

import {
    getMultipleAccountByIdsService
} from '../services/account.service';

//By userId only
export const getAllTransfersByUser = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        res.status(200).json(await getAllTransfersByUserService(userId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Unused
export const getAllOriginTransfersByUser = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        res.status(200).json(await getAllOriginTransfersByUserService(userId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Unused
export const getAllDestinyTransfersByUser = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        res.status(200).json(await getAllDestinyTransfersByUserService(userId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//By userId and accountId
export const getAllTransfersByAccountId = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllTransfersByAccountIdService(userId, accountId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllOriginTransfersByAccountId = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllOriginTransfersByAccountIdService(userId, accountId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllDestinyTransfersByAccountId = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    const { dateFrom, dateTo } = req.query
    const dateFromParsed = miscFunctions.parseDate(dateFrom as string) ?? miscFunctions.getFirstDayOfMonth(new Date())
    const dateToParsed = miscFunctions.parseDate(dateTo as string) ?? miscFunctions.getLastDayOfMonth(new Date())

    if (dateFromParsed && dateToParsed && dateFromParsed > dateToParsed) {
        res.status(400).send({
            message: 'dateFrom must be before dateTo!'
        })
        return
    }

    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllDestinyTransfersByAccountIdService(userId, accountId, dateFromParsed, dateToParsed))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//By transferId
export const getTransferById = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const transferId = +req.params.id

        const transfer = await getTransferByIdService(transferId)

        if (!transfer) {
            res.status(404).send({
                message: 'Transfer not found!'
            })
            return
        }

        //If one is undefined or null, it means that that account was deleted, but anyways I have to let the flow continue
        //But if the account exists, I have to check if the user is the owner
        const originUserIdCondition = transfer.originAccount !== undefined && transfer.originAccount !== null && transfer.originAccount.userId !== userId
        const destinyUserIdCondition = transfer.destinyAccount !== undefined && transfer.destinyAccount !== null && transfer.destinyAccount.userId !== userId

        if (originUserIdCondition || destinyUserIdCondition) {
            res.status(403).send({
                message: 'You are not authorized to access this transfer!'
            })
            return
        }

        //This is made for consistency
        const returnObject = {
            id: transfer.id,
            amount: transfer.amount,
            comment: transfer.comment,
            date: transfer.date,
            originAccountId: transfer.originAccountId,
            destinyAccountId: transfer.destinyAccountId,
        }

        res.status(200).json(returnObject)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Create
export const createTransfer = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const { originAccountId, destinyAccountId, amount, destinyAmount, comment, date } = req.body

        if (originAccountId === undefined || originAccountId === null || destinyAccountId === undefined || destinyAccountId === null) {
            res.status(400).send({
                message: 'You must provide an origin and a destiny account!'
            })
            return
        }

        if (originAccountId === destinyAccountId) {
            res.status(400).send({
                message: 'You must provide different origin and destiny accounts!'
            })
            return
        }

        const accountsArray = await getMultipleAccountByIdsService([originAccountId, destinyAccountId])

        if (accountsArray[0] === undefined || accountsArray[0] === null || accountsArray[1] === undefined || accountsArray[1] === null) {
            res.status(404).send({
                message: 'One or both accounts not found!'
            })
            return
        }

        if (accountsArray[0].userId !== userId || accountsArray[1].userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access one or both accounts!'
            })
            return
        }

        if (amount === undefined || amount === null || amount <= 0) {
            res.status(400).send({
                message: 'You must provide a valid amount!'
            })
            return
        }

        //destinyAmount may be undefined or null, but it's not a problem
        //If that's the case, then it means that both accounts are in the same currency. So I have to check if the amount is valid
        if (accountsArray[0].currencyId !== accountsArray[1].currencyId && (destinyAmount === undefined || destinyAmount === null || destinyAmount <= 0)) {
            res.status(400).send({
                message: 'You must provide a valid destiny amount! (because the accounts are in different currencies)'
            })
            return
        }

        const transferDate = date ?? new Date()

        //If the accounts are in different currencies, then I have to use the destinyAmount, otherwise I have to use the amount
        const destinyAmountToUse: number = accountsArray[0].currencyId !== accountsArray[1].currencyId ? destinyAmount : amount

        const result = await createTransferService(originAccountId, destinyAccountId, amount, destinyAmountToUse, comment, transferDate)

        res.status(201).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Update
export const updateTransfer = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const transferId = +req.params.id
        const { originAccountId, destinyAccountId, amount, destinyAmount, comment, date } = req.body

        if (originAccountId === undefined || originAccountId === null || destinyAccountId === undefined || destinyAccountId === null) {
            res.status(400).send({
                message: 'You must provide an origin and a destiny account!'
            })
            return
        }

        if (originAccountId === destinyAccountId) {
            res.status(400).send({
                message: 'You must provide different origin and destiny accounts!'
            })
        }

        const currentTransfer = await getTransferByIdService(transferId)

        if (!currentTransfer) {
            res.status(404).send({
                message: 'Transfer not found!'
            })
            return
        }

        //If one is undefined or null, it means that that account was deleted, but anyways I have to let the flow continue
        //But if the account exists, I have to check if the user is the owner
        const originUserIdCondition = currentTransfer.originAccount !== undefined && currentTransfer.originAccount !== null && currentTransfer.originAccount.userId !== userId
        const destinyUserIdCondition = currentTransfer.destinyAccount !== undefined && currentTransfer.destinyAccount !== null && currentTransfer.destinyAccount.userId !== userId

        if (originUserIdCondition || destinyUserIdCondition) {
            res.status(403).send({
                message: 'You are not authorized to access this transfer!'
            })
            return
        }

        const newAccountsArray = await getMultipleAccountByIdsService([originAccountId, destinyAccountId])

        if (newAccountsArray[0] === undefined || newAccountsArray[0] === null || newAccountsArray[1] === undefined || newAccountsArray[1] === null) {
            res.status(404).send({
                message: 'One or both accounts not found!'
            })
            return
        }

        if (newAccountsArray[0].userId !== userId || newAccountsArray[1].userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access one or both accounts!'
            })
            return
        }

        //if some of the amounts are null or undefined, then I just doesn't update them
        //if some of the newAmounts are null or undefined, then I sent the old ones for update

        //Anyways, if the amount is not undefined or null, it must be greater than 0
        if (amount !== undefined && amount !== null && amount <= 0) {
            res.status(400).send({
                message: 'You must provide a valid amount!'
            })
            return
        }

        //destinyAmount may be undefined or null, but it's not a problem
        //If that's the case, then it means that both accounts are in the same currency.

        //if it is not undefined or null, destinyAmount must be greater than 0
        if (destinyAmount !== undefined && destinyAmount !== null && destinyAmount <= 0) {
            res.status(400).send({
                message: 'You must provide a valid destiny amount! (because the accounts are in different currencies)'
            })
            return
        }

        const newAmountToUse: number = amount ?? currentTransfer.amount

        //If they are of the same currency, I use the same amount, otherwise I use the destinyAmount if it is not null or undefined, otherwise I use the old destinyAmount
        const newDestinyAmountToUse: number = newAccountsArray[0].currencyId === newAccountsArray[1].currencyId ? newAmountToUse : (destinyAmount ?? currentTransfer.destinyAmount)

        const result = await updateTransferService(currentTransfer.originAccountId, currentTransfer.destinyAccountId, originAccountId, destinyAccountId, transferId, currentTransfer.amount, currentTransfer.destinyAmount, newAmountToUse, newDestinyAmountToUse, comment, date)

        res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Delete
export const deleteTransfer = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const transferId = +req.params.id

        const transfer = await getTransferByIdService(transferId)

        if (!transfer) {
            res.status(404).send({
                message: 'Transfer not found!'
            })
            return
        }

        //If one is undefined or null, it means that that account was deleted, but anyways I have to let the flow continue
        //But if the account exists, I have to check if the user is the owner
        const originUserIdCondition = transfer.originAccount !== undefined && transfer.originAccount !== null && transfer.originAccount.userId !== userId
        const destinyUserIdCondition = transfer.destinyAccount !== undefined && transfer.destinyAccount !== null && transfer.destinyAccount.userId !== userId

        if (originUserIdCondition || destinyUserIdCondition) {
            res.status(403).send({
                message: 'You are not authorized to access this transfer!'
            })
            return
        }

        const result = await deleteTransferService(transferId, transfer.originAccountId, transfer.destinyAccountId, transfer.amount, transfer.destinyAmount)

        res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}