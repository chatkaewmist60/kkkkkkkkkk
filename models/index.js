const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


module.exports = prisma

//or
// module.exports = new (require('@prisma/client')).PrismaClient()