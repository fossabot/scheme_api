const io = require('socket.io')(process.env.PORT)

function initSocket() {
  this.io = io
  this.client = null

  this.startConnection = async () => {
    const self = this
    try {
      this.io.on('connection', client => {
        self.client = client
      })
      if (this.client) {
        return Promise.resolve(this.client)
      } else {
        return Promise.reject(
          'Failed to establish connection, please try again later'
        )
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  this.closeConnection = async () => {
    if (this.client) {
      console.log('Close connection')
    }
  }

  this.emit = function(message, content) {
    return new Promise((resolve, reject) => {
      const emit = this.client.emit(message, content)
      if (emit) {
        resolve('Message successfully sent')
      } else {
        reject('Failed to send message, please try again later')
      }
    })
  }
}

module.exports = new initSocket()
