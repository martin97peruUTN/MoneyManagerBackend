import { Request, Response } from 'express';

import { Prisma, Account } from '@prisma/client'

import {
    getAllAccountsService,
    getAccountByIdService,
    createAccountService,
    updateAccountService,
    deleteAccountService
} from '../services/account.service';

export const getAllAccounts = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        res.status(200).json(await getAllAccountsService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAccountById = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const account = await getAccountByIdService(+req.params.id)
        if (account === null || account.userId !== userId) {
            res.status(404).send({
                message: 'Account not found!'
            })
            return
        }
        res.status(200).json(account)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createAccount = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const { name, balance, currencyId } = req.body

        if (name === undefined || name === "" || currencyId === undefined || currencyId === "") {
            throw new Error("A name and a currency are required");
        }

        const newAccount: Prisma.AccountCreateInput = {
            user: { connect: { id: userId } },
            currency: { connect: { id: currencyId } },
            name: name,
            balance: balance
        }

        const account = await createAccountService(newAccount)
        res.status(200).json(account)

    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateAccount = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        const { name, balance, currencyId } = req.body

        //Before, I make sure it belongs to the user
        const existingAccount = await getAccountByIdService(+req.params.id)
        if (existingAccount === null || existingAccount.userId !== userId) {
            return res.status(404).send({
                message: 'Account not found!'
            })
        }

        const accountData: Prisma.AccountUpdateInput = {
            currency: currencyId ? { connect: { id: currencyId } } : undefined,
            name: name,
            balance: balance
        }

        const account = await updateAccountService(accountData, +req.params.id)
        if (account === null) {
            return res.status(404).send({
                message: 'Account not found!'
            })
        }
        res.status(200).json(account)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    const { userId } = req.body.user
    try {
        //Before, I make sure it belongs to the user
        const existingAccount = await getAccountByIdService(+req.params.id)
        if (existingAccount === null || existingAccount.userId !== userId) {
            return res.status(404).send({
                message: 'Account not found!'
            })
        }

        const account = await deleteAccountService(+req.params.id)
        if (account === null) {
            return res.status(404).send({
                message: 'Account not found!'
            })
        }
        res.status(200).json(account)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}