// module.exports = (func) => {
//      return (req, res, next) =>
//           func(req, res, next).catch(err => next(err))
// }


// or
module.exports = func => (req, res, next) => func(req, res, next).catch(next)