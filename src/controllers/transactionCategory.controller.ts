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
    try {
        res.status(200).json(await getAllTransactionCategoriesService())
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getTransactionCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        res.status(200).json(await getTransactionCategoryByIdService(parseInt(id)))
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createTransactionCategory = async (req: Request, res: Response) => {
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
            isExpense
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