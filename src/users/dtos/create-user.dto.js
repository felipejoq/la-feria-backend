import {createUserSchema} from "./schemas/create-user.schema.js";

export class CreateUserDto {
  constructor(args) {
    const { name, email, password, active, roles } = args;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  static create({body}) {

    let { name, email, password, active } = body;

    const roles = [3];
    active = (typeof active === 'undefined') ? true : !!active;

    const result = createUserSchema.validate({ name, email, password, active, roles });

    if (result.error)
      return [result.error.message, null]

    return [null, new CreateUserDto({ name, email, password, active, roles })];

  }
}