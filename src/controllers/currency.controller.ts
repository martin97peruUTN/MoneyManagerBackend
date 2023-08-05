import { Request, Response } from 'express';

import { Prisma } from '@prisma/client'

import {
    getAllCurrenciesService,
    getCurrencyByIdService,
    createCurrencyService,
    updateCurrencyService,
    deleteCurrencyService
} from '../services/currency.service';

export const getAllCurrencies = async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getAllCurrenciesService())
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getCurrencyById = async (req: Request, res: Response) => {
    try {
        const currency = await getCurrencyByIdService(+req.params.id)
        if (currency === null) {
            res.status(404).send({
                message: 'Currency not found!'
            })
            return
        }
        res.status(200).json(currency)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createCurrency = async (req: Request, res: Response) => {
    try {
        const { name, symbol, code } = req.body
        if (name === undefined || name === "" ||
            symbol === undefined || symbol === "" ||
            code === undefined || code === "") {
            res.status(400).send({
                message: 'A name, symbol and code are required!'
            })
            return
        }

        const newCurrency: Prisma.CurrencyCreateInput = {
            name: name,
            symbol: symbol,
            code: code
        }

        const currency = await createCurrencyService(newCurrency)
        res.status(201).json(currency)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateCurrency = async (req: Request, res: Response) => {
    try {
        const { name, symbol, code } = req.body

        const currency: Prisma.CurrencyUpdateInput = {
            name: name,
            symbol: symbol,
            code: code
        }

        const updatedCurrency = await updateCurrencyService(currency, +req.params.id)
        res.status(200).json(updatedCurrency)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteCurrency = async (req: Request, res: Response) => {
    try {
        const currency = await deleteCurrencyService(+req.params.id)
        if (currency === null) {
            res.status(404).send({
                message: 'Currency not found!'
            })
            return
        }
        res.status(200).send(currency)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}