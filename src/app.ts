import express, { urlencoded, json, Express, Request, Response } from 'express';
//IMPORTANTE: si uso Typescript, no tengo que poner "type":"modules" en el package.json
//Sino no traspila bien. Igualmente aca tengo que usar la notacion de import de TS

import authenticateToken from './middleware/JWTAuthentication';
import { loginRoutes } from './routes/login.routes';
import testsRoutes from './routes/tests.routes';
import userCreationRoute from './routes/userCreation.routes';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';

//import { connectionDB } from './db.js';

const app = express();

//Settings
const port = process.env.PORT || 3000

//Middleware
app.use(urlencoded({ extended: false }))
app.use(json())
//All routes starting with /api will be protected
app.use('/api', authenticateToken)

//Routes
app.use(loginRoutes)
app.use(testsRoutes)
//userCreationRoute is apart because it does not need authentication
app.use(userCreationRoute)
app.use('/api', userRoutes)
app.use('/api', accountRoutes)

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