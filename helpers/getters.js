module.exports = {
  isUserAdmin(user) {
    return user['user_employee_type'] == 1
  }
}
