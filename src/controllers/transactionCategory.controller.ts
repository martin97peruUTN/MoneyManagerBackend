import { Request, Response } from 'express';

import { Prisma } from '@prisma/client'

import {
    getAllTransactionCategoriesService,
    getTransactionCategoryByIdService,
    createTransactionCategoryService,
    updateTransactionCategoryService,
    deleteTransactionCategoryService
} from '../services/transactionCategory.service'

export const getAllTransactionCategories = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        res.status(200).json(await getAllTransactionCategoriesService(userId))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getTransactionCategoryById = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        const { id } = req.params;

        const tc = await getTransactionCategoryByIdService(parseInt(id))

        //Can only be retrieved if it is public or owned by the user
        if (tc === null || (!tc.public && tc.userId !== userId)) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }
        res.status(200).json(tc)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createTransactionCategory = async (req: Request, res: Response) => {

    const { userId } = req.body.user

    try {
        const { name, isExpense } = req.body;
        if (name === undefined || name === "") {
            throw new Error("A name is required");
        }
        if (isExpense === undefined) {
            throw new Error("isExpense is required");
        }

        const newTransactionCategory: Prisma.TransactionCategoryCreateInput = {
            name,
            isExpense,
            User: { connect: { id: userId } }
        }

        const tc = await createTransactionCategoryService(newTransactionCategory)
        res.status(201).json(tc)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateTransactionCategory = async (req: Request, res: Response) => {
    try {
        const { name, isExpense } = req.body;
        const { id } = req.params;
        const { userId, role } = req.body.user

        const transactionCategory = await getTransactionCategoryByIdService(+id)

        if (transactionCategory === null) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }

        //Only admin users can update a public transaction category
        if (transactionCategory.public && role !== 'Admin') {
            res.status(403).send({
                message: 'You can not update a public transaction category!'
            })
            return
        }

        //User can't update a private transaction category that is not his
        if (transactionCategory.userId === null || transactionCategory.userId !== userId) {
            res.status(403).send({
                message: 'You can not update a transaction category that is not yours!'
            })
            return
        }

        //User can update it if:
        //User is admin or it's a private TransactionCategory and belongs to this user.
        const updatedTransactionCategory: Prisma.TransactionCategoryUpdateInput = {
            name,
            isExpense
        }

        const updatedTC = await updateTransactionCategoryService(updatedTransactionCategory, +id)
        res.status(200).json(updatedTC)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteTransactionCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.body.user

        const transactionCategory = await getTransactionCategoryByIdService(+id)

        if (transactionCategory === null) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }

        //Only admin users can delete a public transaction category
        if (transactionCategory.public && role !== 'Admin') {
            res.status(403).send({
                message: 'You can not delete a public transaction category!'
            })
            return
        }

        //User can't delete a private transaction category that is not his
        if (transactionCategory.userId === null || transactionCategory.userId !== userId) {
            res.status(403).send({
                message: 'You can not delete a transaction category that is not yours!'
            })
            return
        }

        //User can delete it if:
        //User is admin or it's a private TransactionCategory and belongs to this user.
        const tc = await deleteTransactionCategoryService(+id)
        if (tc === null) {
            res.status(404).send({
                message: 'Transaction category not found!'
            })
            return
        }
        res.status(200).json(tc)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}