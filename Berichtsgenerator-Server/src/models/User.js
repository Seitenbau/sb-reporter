module.exports = class User {
  constructor({_id, name, surname, username, email, role, password}) {
    this.id = _id.toString();
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
    this.password = password;
  }

  get() {
    return JSON.parse(JSON.stringify(this));
  }
};
