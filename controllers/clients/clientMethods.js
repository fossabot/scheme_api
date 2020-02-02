const Client = require("./../../models/Client");
const User = require("../../models/User");
const helpers = require("../../helpers");

module.exports = {
  getOneClient: async req => {
    try {
      const { clientSubdomain } = req.query;
    
      let foundClient = await Client.findOne({subdomain:clientSubdomain});

      if (foundClient) {
        return Promise.resolve(foundClient);
      } else {
        return Promise.reject("No client found, please try again later");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  deleteClient: async req => {
    const { clientID } = req.body;
    try {
      await Client.deleteOne({ _id: clientID });
      return Promise.resolve("Client successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },

  createClient: async req => {
    let { clientInformation, userInformation } = req.body;

    if (clientInformation.subdomain.length <= 0) {
      clientInformation.subdomain = clientInformation.name;
    }

    try {
      let duplicateClient = await Client.findOne({
        name: clientInformation.clientName
      });

      if (!duplicateClient) {
        let client = await new Client(clientInformation).save();

        // Create admin details

        userInformation.password = helpers.db.genHash(userInformation.password);
        userInformation.employeeType = 1;
        userInformation.clientID = client._id;

        let user = await new User(userInformation).save();
        return Promise.resolve({ user, client });
      } else {
        return Promise.reject(
          "Client already exists, please change the client details"
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getAllClients: async function() {
    try {
      const clients = await Client.find({});
      if (clients.length > 0) {
        return Promise.resolve(clients);
      } else {
        return Promise.reject(
          "No clients detected, please create one to display them."
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  updateClient: async req => {
    const { update } = req.body;
    let { client_id } = req.user;
    try {
      if (await Client.findOne({ _id: client_id })) {
        await Client.findByIdAndUpdate({ _id: req.user.client_id }, update);
        return Promise.resolve();
      } else {
        return Promise.reject("Client not found", client_id);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
