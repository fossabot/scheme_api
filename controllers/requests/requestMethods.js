const Request = require('./../../models/Request')

module.exports = {
  getAllRequests: async function() {
    try {
      const requests = await Request.find({})
      if (requests.length > 0) {
        return Promise.resolve(requests)
      } else {
        return Promise.reject('No requests found, please try again later')
      }
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
