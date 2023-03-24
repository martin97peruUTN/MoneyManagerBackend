const index = (req, res) => {
    res.send('Hello World!')
}

const prueba = (req, res) => {
    res.send('PRUEBA')
}

module.exports = {
    index,
    prueba
}