const express = require('express')
const app = express()
const port = process.env.PORT || 1234

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/prueba', (req, res) => {
  res.send('Pruebaaaaaaa')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})