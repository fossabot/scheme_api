const Client = require("./../../models/Client");
module.exports = {
  deleteClient: async function(req) {
    const params = req.body;
    const clientID = params.client_id;
    try {
      await Client.deleteOne({ _id: clientID });
      return Promise.resolve("Client successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  createClient: async function(req) {
    const params = req.body;
    const companyName = params.company_name;
    const adminName = params.admin_name;
    const logo = params.logo;
    const email = params.email;
    const phone_number = params.phone_number;
    const password = params.password;
    const gender = params.gender;

    const createClient = {
      company_name: companyName,
      logo: logo
    };

    const createdFirstAdmin = {
      email,
      name,
      phone_number,
      employee_type: 1,
      registered,
      password,
      is_online: true,
      gender
    };
    if (!logo) {
      return Promise.reject("Please provide a logo");
    } else if (!name) {
      return Promise.reject("Please provide a name");
    }
    try {
      const client = await Client.findOne({ name: name });
      if (!client) {
        const client = await new Client(createClient).save();
        return Promise.resolve(client);
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
  updateClient: async function(req) {
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
