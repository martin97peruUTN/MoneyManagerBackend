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
    getAccountByIdService,
    updateAccountService
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
        const accountId = +req.params.id
        res.status(200).json(await getAllTransfersByAccountIdService(userId, accountId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllOriginTransfersByAccountId = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const accountId = +req.params.id
        res.status(200).json(await getAllOriginTransfersByAccountIdService(userId, accountId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllDestinyTransfersByAccountId = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
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

        if (transfer.originAccountId === null || transfer.originAccountId === undefined || transfer.destinyAccountId === null || transfer.destinyAccountId === undefined) {
            res.status(404).send({
                message: 'There is a problem with this transfer!'
            })
        }

        if (transfer.originAccount.userId !== userId && transfer.destinyAccount.userId !== userId) {
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

        if (originAccountId === null || originAccountId === undefined || destinyAccountId === null || destinyAccountId === undefined) {
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

        if (amount === null || amount === undefined || amount <= 0) {
            res.status(400).send({
                message: 'You must provide a valid amount!'
            })
            return
        }

        const originAccount = await getAccountByIdService(originAccountId)

        if (!originAccount) {
            res.status(404).send({
                message: 'Origin account not found!'
            })
            return
        }

        if (originAccount.userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access this origin account!'
            })
            return
        }

        const destinyAccount = await getAccountByIdService(destinyAccountId)

        if (!destinyAccount) {
            res.status(404).send({
                message: 'Destiny account not found!'
            })
            return
        }

        if (destinyAccount.userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access this destiny account!'
            })
            return
        }

        //TODO generalizar para cualquier tipo de moneda, algo como un conversion rate o que vengan 2 valores de amount
        if (originAccount.currencyId !== destinyAccount.currencyId) {
            res.status(400).send({
                message: 'You must provide origin and destiny accounts with the same currency!'
            })
            return
        }

        //TODO I Let the user transfer despite the balance, doesn't matters if the origin account has enough money or not, it will be negative
        // if (originAccount.balance < amount) {...}

        //Update of the origin and destiny accounts
        const updateOriginAccountObject: Prisma.AccountUpdateInput = {
            balance: originAccount.balance - amount
        }

        const updateDestinyAccountObject: Prisma.AccountUpdateInput = {
            balance: destinyAccount.balance + amount
        }

        updateAccountService(updateOriginAccountObject, originAccountId)

        updateAccountService(updateDestinyAccountObject, destinyAccountId)

        //Creation of the transfer
        const newTransfer: Prisma.TransferCreateInput = {
            originAccount: { connect: { id: originAccountId } },
            destinyAccount: { connect: { id: destinyAccountId } },
            amount: amount,
            comment,
            date: date ?? new Date()
        }

        res.status(201).json(await createTransferService(newTransfer))
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

        if (originAccountId === destinyAccountId) {
            res.status(400).send({
                message: 'You must provide different origin and destiny accounts!'
            })
        }

        //TODO hacer algo parecido con las accounts a lo que hice al crear

        const transfer = await getTransferByIdService(transferId)

        if (!transfer) {
            res.status(404).send({
                message: 'Transfer not found!'
            })
            return
        }

        if (transfer.originAccountId === null || transfer.originAccountId === undefined || transfer.destinyAccountId === null || transfer.destinyAccountId === undefined) {
            res.status(404).send({
                message: 'There is a problem with this transfer!'
            })
        }
        if (transfer.originAccount.userId !== userId && transfer.destinyAccount.userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access this transfer!'
            })
            return
        }

        const updateTransfer: Prisma.TransferUpdateInput = {
            originAccount: { connect: { id: originAccountId } },
            destinyAccount: { connect: { id: destinyAccountId } },
            amount,
            comment,
            date
        }

        //If there is an originAccountId and/or an destinyAccountId, update it
        // if (originAccountId !== null && originAccountId !== undefined) {
        //     updateTransfer.originAccount = { connect: { id: originAccountId } }
        // }
        // if (destinyAccountId !== null && destinyAccountId !== undefined) {
        //     updateTransfer.destinyAccount = { connect: { id: destinyAccountId } }
        // }

        res.status(200).json(await updateTransferService(updateTransfer, transferId))
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

        // if (transfer.originAccountId === null || transfer.originAccountId === undefined || transfer.destinyAccountId === null || transfer.destinyAccountId === undefined) {
        //     res.status(404).send({
        //         message: 'There is a problem with this transfer!'
        //     })
        // }

        if (transfer.originAccount.userId !== userId && transfer.destinyAccount.userId !== userId) {
            res.status(403).send({
                message: 'You are not authorized to access this transfer!'
            })
            return
        }

        res.status(200).json(await deleteTransferService(transferId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}