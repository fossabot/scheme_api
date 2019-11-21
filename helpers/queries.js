module.exports = (model, params) => {
  function findOne() {
    try {
        const response = model.findOne(params.find);
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
  function deleteOne() {}
  function insertOne() {}
  function findMany() {}
  function findAll() {}
  function updateAll() {}
  function updateOne(){
    try {
              const response = this.model.updateOne(this.params.find)
              return Promise.resolve(response)
            } catch (error) {
              return Promise.reject(error)
            }
  }

  return {
    findOne: findOne,
    deleteOne: deleteOne,
    insertOne: insertOne,
    findMany: findMany,
    findAll: findAll,
    updateAll: updateAll,
    updateOne:updateOne
  }
}
