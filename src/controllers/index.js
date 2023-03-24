const index = (req, res) => {
    res.send('Hello World!')
}

const prueba = (req, res) => {
    res.send('PRUEBA')
}

export default {
    index,
    prueba
}