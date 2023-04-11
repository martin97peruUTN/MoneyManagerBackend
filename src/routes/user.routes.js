import { Router } from 'express';

import { getAllUsers, getUserById, createUser, createUser2, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = Router()

router.get('/api/user', getAllUsers)

router.get('/api/user/:id', getUserById)

router.post('/api/user', createUser)

router.post('/api/user2', createUser2)

router.put('/api/user/:id', updateUser)

router.delete('/api/user/:id', deleteUser)

export default router;