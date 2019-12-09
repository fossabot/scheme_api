const bcrypt = require('bcrypt')

module.exports = {
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
