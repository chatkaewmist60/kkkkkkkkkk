module.exports = (statusCode, message) => {
     const error = new Error()
     error.statusCode = statusCode
     
     throw(error)
}