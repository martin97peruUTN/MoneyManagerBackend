import express from 'express';

const router = express.Router()

router.get('/user', (req, res) => {
    res.send('User route')
})

router.get('/profile', (req, res) => {
    res.send('Profile route')
})

export {router as routerUsers}