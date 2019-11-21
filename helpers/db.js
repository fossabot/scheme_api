// Validation
const bcrypt = require('bcrypt')

module.exports = {
  query: async function(action, model, params) {
    const queries = require('./queries')(model, params)
    switch (action) {
      case 'findOne': {
        return queries.findOne()
        break
      }

      default:
        break
    }
  },
  genHash: async function(string) {
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(string, salt)
    return hash
  },

  compareHash: async function(initString, stringToCompare) {
    let isSame = await bcrypt.compare(initString, stringToCompare)
    return isSame
  }
}

// function queries(model, params) {
//   this.model = model
//   this.params = params
//   this.findOne = async function() {

//   this.updateOne = async function() {
//     try {
//       const response = this.model.updateOne(this.params.find)
//       return Promise.resolve(response)
//     } catch (error) {
//       return Promise.reject(error)
//     }
//   }

//   this.deleteOne = async function() {
//     try {
//       const response = this.model.deleteOne(this.params.find)
//       return Promise.resolve(response)
//     } catch (error) {
//       return Promise.reject(error)
//     }
//   }
// }
