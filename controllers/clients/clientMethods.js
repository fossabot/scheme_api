const Client = require("./../../models/Client");
const User = require("../../models/User");
const helpers = require("../../helpers");
const fs = require("fs");
module.exports = {
  getOneClient: async req => {
    try {
      const { client_name } = req.query;

      let foundClient = await Client.findOne({ company_name: client_name });

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
    let {
      company_name,
      company_image,
      company_colours,
      company_phone,
      name,
      email,
      phone_number,
      password,
      gender
    } = req.body;

    let createClient = {
      company_name,
      company_phone,
      company_image,
      company_colours
    };

    if (!company_image) {
      return Promise.reject("Please provide a logo");
    } else if (!company_name) {
      return Promise.reject("Please provide a name");
    }
    try {
      let duplicateClient = await Client.findOne({ company_name });

      if (!duplicateClient) {
        let newClient = await new Client(createClient).save();
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
    const params = req.body;
    const clientUpdate = parmas.client_update;
    const clientID = params.client_id;
    try {
      const clients = await Client.updateOne({ _id: clientID }, clientUpdate);
      return Promise.resolve("Successfully updated client");
    } catch (error) {
      return Promise.reject("Failed to update client please try again.");
    }
  }
};
