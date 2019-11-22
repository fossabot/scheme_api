const Client = require('./../../models/Client')
module.exports = {
  createClient: async function(req) {
    const params = req.body
    const name = params.name
    const logo = params.logo

    const createClient = {
      name: name,
      logo: logo
    }
    if (!logo) {
      return Promise.reject('Please provide a logo')
    } else if (!name) {
      return Promise.reject('Please provide a name')
    }
    try {
      const client = await Client.findOne({ name: name })
      if (client.length <= 0) {
        const client = await new Client(createClient).save()
        return Promise.resolve(client)
      } else {
        return Promise.reject(
          'Client already exists, please change the client details'
        )
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getAllClients: async function() {
    try {
      const clients = await Client.find({})
      if (clients.length > 0) {
        return Promise.resolve(client)
      } else {
        return Promise.reject(
          'No clients detected, please create one to display them.'
        )
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateClient: async function(req) {
    const params = req.body
    const clientUpdate = parmas.client_update
    const clientID = params.client_id
    try {
      const clients = await Client.updateOne({ _id: clientID }, clientUpdate)
      return Promise.resolve('Successfully updated client')
    } catch (error) {
      return Promise.reject('Failed to update client please try again.')
    }
  }
}
