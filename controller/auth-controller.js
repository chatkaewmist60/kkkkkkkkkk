const jwt = require('jsonwebtoken')
const prisma = require('../models')
const bcrypt = require('bcryptjs')
const createError = require("../utils/createError")
const tryCatch = require('../utils/tryCatch')

function checkEmailorMobile(identity) {
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
     const mobileRegex = /^[0-9]{10,15}$/
     let identityKey = ''
     if (emailRegex.test(identity)) {
          identityKey = 'email'
     }
     if (mobileRegex.test(identity)) {
          identityKey = 'mobile'
     }
     if (!identityKey) {
          createError(400, 'only email or mobile phone')
     }
     return identityKey
}


module.exports.register = tryCatch(async (req, res, next) => {
     const { identity, firstName, lastName, password, confirmPassword } = req.body
     // validation
     if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
          createError(400, 'Please fill all data')
     }
     if (password !== confirmPassword) {
          createError(400, 'Please check confirm password')
     }
     //identity email or mobile phone
     const identityKey = checkEmailorMobile(identity)
     //find user มีหรือไม่มี
     const findIdentity = await prisma.user.findUnique({
          where: { [identityKey]: identity }
     })
     if (findIdentity) {
          createError(400, 'Already have this user')
     }
     const newUser = {
          [identityKey]: identity,
          password: await bcrypt.hash(password, 10),
          firstName: firstName,
          lastName: lastName
     }
     const result = await prisma.user.create({ data: newUser })
     console.log(result)
     res.json({ message: `Register successful`, result })

})



module.exports.login = tryCatch(async (req, res, next) => {
     const { identity, password } = req.body
     //validation
     if (!identity.trim() || !password.trim()) {
          createError(400, 'Please fill data')
     }
     //check email or mobile
     const identityKey = checkEmailorMobile(identity)
     // find user
     const foundUser = await prisma.user.findUnique({
          where: { [identityKey]: identity }
     })
     if (!foundUser) {
          createError(401, 'Invalid Login')
     }
     //check password
     let passwordOk = await bcrypt.compare(password, foundUser.password)
     if (!passwordOk) {
          createError(401, 'Invalid Login')
     }
     const payload = { id: foundUser.id }
     const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '15d'
     })


     // delete foundUser.password
     // delete foundUser.createdAt
     // delete foundUser.updatedAt

     const { password: pw, createdAt, updatedAt, ...userData } = foundUser

     res.json({ message: 'Login successful', token, user: userData })
})



module.exports.getMe = (req, res) => {
     res.json({ message: 'GetMe...' })
}

