import express, { urlencoded, json } from 'express';

import authenticateToken from './middleware/JWTAuthentication.js';
import { login } from './routes/login.js';
import { tests } from './routes/tests.js';

import { connectionDB } from './db.js';
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

// Este ahora no anda porque le puse el /promise al mysql2
// app.get('/dbtest', (req, res) => {
// 	connectionDB.query('SELECT 1 + 1 AS Suma', (err, results, fields) => {
// 		if (err) {
// 			console.log(err)
// 			res.status(500).send('Error en la base de datos')
// 		}
// 		res.status(200).send(results)
// 	})
// })

app.get('/dbtest2', async (req, res) => {
	const [result] = await connectionDB.query('SELECT 1 + 1 AS result')
	res.status(200).json(result[0])
})

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})