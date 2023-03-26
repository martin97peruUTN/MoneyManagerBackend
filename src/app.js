import express, { urlencoded, json } from 'express';

import authenticateToken from './middleware/JWTAuthentication.js';
import { login } from './routes/login.js';
import { tests } from './routes/tests.js';

//const connectDB = require('./db.js')
//connectDB()

const app = express();

//Settings
const port = process.env.PORT || 3000

//Middleware
app.use(urlencoded({ extended: false }))
app.use(json())
//All routes starting with /api will be protected
app.use('/api', authenticateToken)

//Routes
app.use(login)
app.use(tests)

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})