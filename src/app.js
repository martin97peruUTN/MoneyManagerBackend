const express = require('express');

const authenticateToken = require('./middleware/JWTAuthentication')
const {login} = require('./routes/login')
const {tests} = require('./routes/tests')

//const connectDB = require('./db.js')
//connectDB()

const app = express();

//Settings
const port = process.env.PORT || 3000

//Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//All routes starting with /api will be protected
app.use('/api', authenticateToken)

//Routes
app.use(login)
app.use(tests)

app.listen(port, () => {
	console.log(`Listening on port ${port} 😎 🤙`)
})