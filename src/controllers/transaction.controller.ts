import { Request, Response } from 'express';

import { Prisma } from '@prisma/client'

import {
    getAllTransactionsService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService
} from '../services/transaction.service'

import { getAccountByIdService } from '../services/account.service'

import { getTransactionCategoryByIdService } from '../services/transactionCategory.service'

export const getAllTransactions = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        res.status(200).json(await getAllTransactionsService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getTransactionById = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        const { id } = req.params;

        const transaction = await getTransactionByIdService(parseInt(id), userId)

        //Can only be retrieved if it is public or owned by the user
        if (transaction === null) {
            res.status(404).send({
                message: 'Transaction not found!'
            })
            return
        }

        res.status(200).json(transaction)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createTransaction = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        const { amount, comment, date, accountId, transactionCategoryId } = req.body;

        if (amount === undefined || amount === "") {
            res.status(400).send({
                message: 'An amount is required!'
            })
            return
        }
        if (amount <= 0) {
            res.status(400).send({
                message: 'Amount must be greater than 0!'
            })
            return
        }

        if (accountId === undefined || accountId === "") {
            res.status(400).send({
                message: 'An account is required!'
            })
            return
        }
        const account = await getAccountByIdService(accountId, userId)
        if (account === null) {
            res.status(404).send({
                message: 'Account not found!'
            })
            return
        }

        if (transactionCategoryId === undefined || transactionCategoryId === "") {
            res.status(400).send({
                message: 'A transaction category is required!'
            })
            return
        }

        const transactionCategory = await getTransactionCategoryByIdService(transactionCategoryId)
        //Can only be retrieved if it is public or owned by the user
        if (transactionCategory === null || (!transactionCategory.public && transactionCategory.userId !== userId)) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }

        const transactionDate = date ?? new Date()

        const createdTransaction = await createTransactionService(amount, comment, transactionDate, accountId, transactionCategoryId, transactionCategory.isExpense)

        res.status(201).json(createdTransaction)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}