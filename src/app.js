import express, { urlencoded, json } from 'express';

import authenticateToken from './middleware/JWTAuthentication.js';
import { loginRoutes } from './routes/login.routes.js';
import testsRoutes from './routes/tests.routes.js';
import userRoutes from './routes/user.routes.js';

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
app.use('/api', userRoutes)

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})