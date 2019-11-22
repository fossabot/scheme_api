const Request = require('./../../models/Request')

module.exports = {
  getAllRequests: async function() {
    try {
      const requests = await Request.find({})
      return Promise.resolve(requests)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateRequest: async function(req) {
    const params = req.body
    const requestUpdate = params.request_update
    try {
      const request = await Request.updateOne(
        { _id: params.request_id },
        requestUpdate
      )
      return Promise.resolve('Request successfully updated')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
