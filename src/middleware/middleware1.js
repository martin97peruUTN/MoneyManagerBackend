const middleware1 = (req, res, next) => {
    console.log("Middleware 1")
    next()
}

module.exports = middleware1;