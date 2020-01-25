const Client = require("./../../models/Client");
const User = require("../../models/User");
const helpers = require("../../helpers");

module.exports = {
  getOneClient: async req => {
    try {
      const { client_subdomain } = req.query;
      console.log(client_subdomain);
      let foundClient = await Client.findOne({ client_subdomain });

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
    const { client_id } = req.body;
    try {
      await Client.deleteOne({ _id: client_id });
      return Promise.resolve("Client successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  createClient: async req => {
    // Recieved details
    let {
      client_name,
      client_image,
      client_colours,
      client_phone,
      name,
      email,
      phone_number,
      password,
      gender,
      storage_ref,
      client_subdomain
    } = req.body;
    // Client details
    let createClient = {
      client_name,
      client_phone,
      client_image,
      client_colours,
      storage_ref,
      client_subdomain
    };
    if (
      !storage_ref ||
      !client_image ||
      !client_name ||
      !client_subdomain ||
      !client_phone
    ) {
      return Promise.reject(
        "Missing client data, please re-enter the required fields and try again"
      );
    }
    try {
      let duplicateClient = await Client.findOne({
        client_name
      });

      if (!duplicateClient) {
        let newClient = await new Client(createClient).save();

        // Create admin details
        const createdFirstAdmin = {
          client_id: newClient._id,
          email,
          name,
          phone_number,
          employee_type: 1,
          password: helpers.db.genHash(password),
          is_online: true,
          gender
        };

        let admin = await new User(createdFirstAdmin).save();

        return Promise.resolve({ user: admin, client: newClient });
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
