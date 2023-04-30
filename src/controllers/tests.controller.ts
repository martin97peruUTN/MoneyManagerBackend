import { Request, Response } from 'express';
import {
    indexService,
    dbtestService
} from '../services/tests.service';

export const index = (_req: Request, res: Response) => {
    res.send(indexService())
}

export const dbtest = async (_req: Request, res: Response) => {
    const result = await dbtestService()
    res.send(result)
}