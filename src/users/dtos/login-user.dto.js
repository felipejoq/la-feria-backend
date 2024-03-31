import {loginUserSchema} from "./schemas/login-user.schema.js";

export class LoginUserDto {
  constructor({email, password}) {
    this.email = email;
    this.password = password;
  }

  static create({email, password}) {

    const result = loginUserSchema.validate({email, password});

    if (result.error)
      return [result.error.message, null];

    return [null, new LoginUserDto({email, password})];
  }

}