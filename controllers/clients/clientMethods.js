const Client = require('./../../models/Client')
module.exports = {
  createClient: async function(req) {
    const name = req.name
    try {
      const client = new Client(name).save()
      return Promise.resolve(client)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
