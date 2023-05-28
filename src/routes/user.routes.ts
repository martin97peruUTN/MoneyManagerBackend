import { Router } from 'express';

import {
    getAllUsers,
    getUserById,
    /*createUser2,*/
    updateUser,
    deleteUser
} from '../controllers/user.controller';
//} from '../controllers/user.mysql2.controller';

const router = Router()

router.get('/user', getAllUsers)

router.get('/user/:id', getUserById)

//router.post('/user2', createUser2)

router.patch('/user/:id', updateUser)

router.delete('/user/:id', deleteUser)

export default router;