export class User {
  constructor({id, name, email, password, active, roles}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.active = active;
  }
}