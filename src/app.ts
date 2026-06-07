import express, { urlencoded, json, Express, Request, Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import swaggerUi from 'swagger-ui-express';

import { auth } from './lib/auth';
import authenticateToken from './middleware/JWTAuthentication';
import isAdmin from './middleware/AdminRoute';
import { swaggerSpec } from './config/swagger';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import currencyRoutes from './routes/currency.routes';
import transactionCategoryRoutes from './routes/transactionCategory.routes';
import transferRoutes from './routes/transfer.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();

//Settings
// Default 1234 with Next.js on 3000 (set PORT in .env to override).
const port = process.env.PORT || 1234

//Middleware — credentials must be allowed so the Better Auth session cookie is
//sent on cross-origin requests. With FRONTEND_ORIGIN unset, reflect the request
//origin for local dev; in production set it to the exact frontend URL.
app.use(cors({
	origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN : true,
	credentials: true
}))

//Better Auth catch-all — MUST be mounted before express.json() (it parses the
//body itself) and before the /api JWT/session guard so /api/auth/* is public.
app.all('/api/auth/*', toNodeHandler(auth))

app.use(urlencoded({ extended: false }))
app.use(json())

//Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	customCss: '.swagger-ui .topbar { display: none }',
	customSiteTitle: 'Money Manager API Documentation'
}))

//All routes starting with /api will be protected
app.use('/api', authenticateToken)
//All routes starting with /api/admin will be admin only
app.use('*/admin', isAdmin)

/**Admin routes:
 * 	User:
 * 		GET: /admin/user
 * 		GET: /admin/user/:id
 * 	Currency:
 * 		POST: /admin/currency
 * 		PATCH: /admin/currency/:id
 * 		DELETE: /admin/currency/:id
 * 	TransactionCategory:
 * 		PATCH: transactionCategory/:id (when updating a public transaction category, only admin can do it)
 * 		DELETE: transactionCategory/:id (when deleting a public transaction category, only admin can do it)
 */

//Routes
app.use('/api', userRoutes)
app.use('/api', accountRoutes)
app.use('/api', currencyRoutes)
app.use('/api', transactionCategoryRoutes)
app.use('/api', transferRoutes)
app.use('/api', transactionRoutes)

//Not found
//TS no hace falta poner Request y Response explicitamente, son inferidos porque app es de tipo Express
app.use((_req, res) => {
	res.status(404).send({
		message: 'Endpoint not found 🤷‍♂️'
	})
})

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})