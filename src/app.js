
const express = require('express');
//import middleware1 from './middleware/middleware1.js';
const routes = require('./routes/index.js')
const {routerUsers} = require('./routes/users.js')
const connectDB = require('./db.js')

connectDB()

const app = express();

//settings
const port = process.env.PORT || 1234

//middlewares
//app.use(middleware1)

//routes
app.use(routes)
app.use(routerUsers)

app.listen(port, () => {
  console.log(`Example app listening on port ${port} 😎`)
})