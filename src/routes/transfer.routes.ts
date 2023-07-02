import { Router } from 'express';

import {
    getAllTransfersByUser,
    getAllOriginTransfersByUser,
    getAllDestinyTransfersByUser,
    getAllTransfersByAccountId,
    getAllOriginTransfersByAccountId,
    getAllDestinyTransfersByAccountId,
    getTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer
} from '../controllers/transfer.controller';

const router = Router()

router.get('/transfers', getAllTransfersByUser)

//Unused
router.get('/transfers/origin', getAllOriginTransfersByUser)

//Unused
router.get('/transfers/destiny', getAllDestinyTransfersByUser)

router.get('/transfers/account/:id', getAllTransfersByAccountId)

router.get('/transfers/account/:id/origin', getAllOriginTransfersByAccountId)

router.get('/transfers/account/:id/destiny', getAllDestinyTransfersByAccountId)

router.get('/transfer/:id', getTransferById)

router.post('/transfer', createTransfer)

router.patch('/transfer/:id', updateTransfer)

router.delete('/transfer/:id', deleteTransfer)

export default router;