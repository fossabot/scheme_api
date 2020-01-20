const Client = require("./../../models/Client");
const User = require("../../models/User");
const helpers = require("../../helpers");

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
    // Init the sightengine

    let {
      company_name,
      company_image,
      company_colours,
      company_phone,
      name,
      email,
      phone_number,
      password,
      gender,
      storage_ref,
      company_subdomain
    } = req.body;

    let createClient = {
      company_name,
      company_phone,
      company_image,
      company_colours,
      storage_ref
    };
    if (
      !company_image ||
      !company_name ||
      !company_subdomain ||
      !company_phone
    ) {
      return Promise.reject(
        "Missing company data, please re-enter the required fields and try again"
      );
    }
    try {
      let duplicateClient = await Client.findOne({
        company_name: company_name.toLowerCase().trim()
      });

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
