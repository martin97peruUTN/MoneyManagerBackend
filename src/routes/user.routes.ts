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

/**
 * @swagger
 * /api/admin/user:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve all users. Only administrators can perform this action
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.get('/admin/user', getAllUsers)

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     description: Retrieve a specific user by ID. Only administrators can perform this action
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.get('/admin/user/:id', getUserById)

//router.post('/user2', createUser2)

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Update user profile
 *     description: Update user profile information. Users can only update their own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (cannot update another user's profile)
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/user/:id', updateUser)

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete a user account. Users can only delete their own account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden (cannot delete another user's account)
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/user/:id', deleteUser)

export default router;