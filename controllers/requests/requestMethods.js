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
  declineRequest: async function(req, helpers) {
    try {
      const params = req.body
      const declinedObj = {
        is_approved: {
          admin: 1
        }
      }
      const request = await Request.updateOne(
        { _id: params.request_id },
        declinedObj
      )
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  approveRequest: async function(req, helpers) {
    const params = req.body
    const approveObj = {
      is_approved: {
        admin: 1
      }
    }
    try {
      const request = await Request.updateOne(
        { _id: params.request_id },
        approveObj
      )
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
