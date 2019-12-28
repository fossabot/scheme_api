var simplecrypt = require('simplecrypt')
var sc = simplecrypt()

module.exports = {
  genHash(string) {
    let hash = sc.encrypt(string)
    return hash
  },

  compareHash(string, compareString) {
    let decryptedString = sc.decrypt(string)
    let isSame = decryptedString.trim() == compareString.trim()
    return isSame
  }
}
