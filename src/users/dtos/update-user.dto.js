import {updateUserSchema} from "./schemas/update-user.schema.js";

export class UpdateUserDto {
  constructor(args) {
    const { id, name, email, active, roles } = args;
    this.id = id
    this.name = name;
    this.email = email;
    this.active = active;
    this.roles = roles;
  }

  static create({ id, body }) {

    let { name, email, active } = body;

    const result = updateUserSchema.validate({ id, name, email, active });

    if (result.error)
      return [result.error.message, null]

    const roles = [3];
    active = (typeof active === 'undefined') ? true : !!active;

    const args = { id: +id, name, email, active, roles }

    return [null, new UpdateUserDto(args)];

  }
}