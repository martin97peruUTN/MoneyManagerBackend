import { Router } from 'express';

import {
    getAllUsers,
    getUserById,
    createUser,
    /*createUser2,*/
    updateUser,
    deleteUser
} from '../controllers/user.controller';

const router = Router()

router.get('/user', getAllUsers)

router.get('/user/:id', getUserById)

router.post('/user', createUser)

//router.post('/user2', createUser2)

router.patch('/user/:id', updateUser)

router.delete('/user/:id', deleteUser)

export default router;