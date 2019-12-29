const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.ENCRYPT_SECRET)

module.exports = {
  genHash(string) {
    let hash = cryptr.encrypt(string)
    return hash
  },

  compareHash(compareString, encryptedString) {
    let decryptedString = cryptr.decrypt(encryptedString)
    let isSame = decryptedString.trim() == compareString.trim()
    return isSame
  }
}
