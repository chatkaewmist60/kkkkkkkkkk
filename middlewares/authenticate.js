const createError = require("../utils/createError")




module.exports = (req,res,next) => {
     const authorization = req.headers.authorization

     if(!authorization || authorization.startsWith('Bearer ')) {
          createError(401, 'Unauthorized 1')
     }
     const token = authorization.split(' '[1])
     console.log(token)
     next()
}