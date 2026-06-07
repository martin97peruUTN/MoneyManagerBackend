import { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'

import { auth } from '../lib/auth'

/**
 * Validates the Better Auth session cookie and attaches the user to
 * `req.body.user` as `{ userId, role, ... }` for the downstream controllers.
 */
async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!req.body || typeof req.body !== 'object') {
            req.body = {}
        }

        req.body.user = {
            userId: session.user.id,
            role: session.user.role ?? 'user',
            email: session.user.email,
            name: session.user.name,
        }

        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

export default authenticateToken
