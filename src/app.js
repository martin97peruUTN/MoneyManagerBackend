const express = require('express');

const authenticateToken = require('./middleware/JWTAuthentication')
const {unprotectedRoutes} = require('./routes/unprotectedRoutes.js')
const {protectedRoutes} = require('./routes/protectedRoutes')

//const connectDB = require('./db.js')
//connectDB()

const app = express();

//settings
const port = process.env.PORT || 1234

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//routes
app.use(unprotectedRoutes)
app.use(authenticateToken)
app.use(protectedRoutes)

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})