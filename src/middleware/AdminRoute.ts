import { Request, Response, NextFunction } from 'express'

function isAdmin(req: Request, res: Response, next: NextFunction) {
    const { role } = req.body.user
    if (role == 'Admin') {
        next()
    } else {
        res.status(401).send('Admin only route')
        return;
    }
}

export default isAdmin