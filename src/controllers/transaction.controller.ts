import { Request, Response } from 'express';

import { Prisma, TransactionCategory } from '@prisma/client'

import {
    getAllTransactionsService,
    getAllTransactionsExpensesService,
    getAllTransactionsIncomesService,
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

export const getAllTransactionsExpenses = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        res.status(200).json(await getAllTransactionsExpensesService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getAllTransactionsIncomes = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        res.status(200).json(await getAllTransactionsIncomesService(userId))
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

export const updateTransaction = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {

        const transactionId = parseInt(req.params.id)
        const { amount, comment, date, accountId, transactionCategoryId } = req.body;

        const transaction = await getTransactionByIdService(transactionId, userId)

        if (transaction === null) {
            res.status(404).send({
                message: 'Transaction not found!'
            })
            return
        }

        if (accountId === undefined || accountId === null) {
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
        }

        const oldTransactionCategory = await getTransactionCategoryByIdService(transaction.transactionCategoryId)
        //Can only be retrieved if it is public or owned by the user
        if (oldTransactionCategory === null || (!oldTransactionCategory.public && oldTransactionCategory.userId !== userId)) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }

        if (transactionCategoryId === undefined || transactionCategoryId === null) {
            res.status(400).send({
                message: 'A transaction category is required!'
            })
            return
        }

        let newTransactionCategory: TransactionCategory | null = oldTransactionCategory

        if (transaction.transactionCategoryId !== transactionCategoryId) {
            newTransactionCategory = await getTransactionCategoryByIdService(transactionCategoryId)
            //Can only be retrieved if it is public or owned by the user
            if (newTransactionCategory === null || (!newTransactionCategory.public && newTransactionCategory.userId !== userId)) {
                res.status(404).send({
                    message: 'Transaction category not found!'
                })
                return
            }
        }

        const newAmount = amount ?? transaction.amount

        const updatedTransaction = await updateTransactionService(transactionId, transaction.accountId, accountId, oldTransactionCategory.isExpense, newTransactionCategory.id, newTransactionCategory.isExpense, transaction.amount, newAmount, comment, date)

        res.status(200).json(updatedTransaction)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteTransaction = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        const transaction = await getTransactionByIdService(parseInt(req.params.id), userId)

        if (transaction === null) {
            res.status(404).send({
                message: 'Transaction not found!'
            })
            return
        }

        const transactionCategory = await getTransactionCategoryByIdService(transaction.transactionCategoryId)
        //Can only be retrieved if it is public or owned by the user
        if (transactionCategory === null || (!transactionCategory.public && transactionCategory.userId !== userId)) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }

        const result = await deleteTransactionService(transaction.id, transaction.accountId, transactionCategory.isExpense, transaction.amount)

        res.status(200).send(result)

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}