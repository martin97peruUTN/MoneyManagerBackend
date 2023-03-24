
import express from 'express';
import routes from './routes/index.js'

const app = express();

//settings
const port = process.env.PORT || 1234

//middlewares


//routes
app.use(routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port} 😎`)
})