import { Request, Response } from 'express';

import { Prisma } from '@prisma/client'

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
    try {
        res.status(200).json(await getAllTransfersByUserService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Unused
export const getAllOriginTransfersByUser = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        res.status(200).json(await getAllOriginTransfersByUserService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Unused
export const getAllDestinyTransfersByUser = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        res.status(200).json(await getAllDestinyTransfersByUserService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//By userId and accountId
export const getAllTransfersByAccountId = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllTransfersByAccountIdService(userId, accountId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllOriginTransfersByAccountId = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllOriginTransfersByAccountIdService(userId, accountId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllDestinyTransfersByAccountId = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        //I don't check if the accounts belong to the user because the service method already does it
        const accountId = +req.params.id
        res.status(200).json(await getAllDestinyTransfersByAccountIdService(userId, accountId))
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
        const { originAccountId, destinyAccountId, amount, comment, date } = req.body

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

        if (amount === undefined || amount === null || amount <= 0) {
            res.status(400).send({
                message: 'You must provide a valid amount!'
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

        //TODO generalizar para cualquier tipo de moneda, algo como un conversion rate o que vengan 2 valores de amount
        //TODO lo mismo para el update
        if (accountsArray[0].currencyId !== accountsArray[1].currencyId) {
            res.status(400).send({
                message: 'You must provide origin and destiny accounts with the same currency!'
            })
            return
        }

        const transferDate = date ?? new Date()

        const arrayResult = await createTransferService(originAccountId, destinyAccountId, amount, comment, transferDate)

        res.status(201).json(arrayResult)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

//Update
export const updateTransfer = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const transferId = +req.params.id
        const { originAccountId, destinyAccountId, amount, comment, date } = req.body

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

        const resultArray = await updateTransferService(currentTransfer.originAccountId, currentTransfer.destinyAccountId, originAccountId, destinyAccountId, transferId, currentTransfer.amount, amount, comment, date)

        res.status(200).json(resultArray)
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

        const arrayResult = await deleteTransferService(transferId, transfer.originAccountId, transfer.destinyAccountId, transfer.amount)

        res.status(200).json(arrayResult)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}