const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    try {
            const token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, 'AzQPI!')

            req.user = decode
            next()
    }
    catch(error){
        if(error.name == "TokenExpiredError"){
            res.status(401).json({
                message: "token Expired"
            })
        } else {
        res.json({
            message: 'authentication failed'
        })
       }
    }
}

module.exports = authenticate