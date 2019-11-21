const Request = require('./../../models/Request')

module.exports = {
  getAllRequests: async function() {
    try {
      const requests = await Request.find({})
      return Promise.resolve(requests)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
