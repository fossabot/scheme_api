module.exports = {
  isUserAdmin: function(user) {
    return user['user_employee_type'] == 1
  }
}
