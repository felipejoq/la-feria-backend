import {CustomError} from "../../config/errors/custom.error.js";

export class UpdateRolesUserDto {

  constructor(userID, roles) {
    this.userId = userID;
    this.roles = roles;
  }

  static create({ userId, roles, user }) {

    if(isNaN(+userId))
      return [CustomError.badRequest('El id no es válido'), null]

    if(!roles || !Array.isArray(roles) || roles.length === 0)
      return [CustomError.badRequest('Los roles no son válidos'), null];

    // Un administrador no puede quitar su rol administrador
    const isAdmin = user.roles.find(role => role.id === 1);
    const includeAdminRole = roles.includes(1);
    const isSameUser = Number(userId) === Number(user.id);
    if(isAdmin && !includeAdminRole && isSameUser)
      return [CustomError.badRequest('Un administrador no puede quitarse su rol de administrador'), null];

    return [null, new UpdateRolesUserDto(userId, roles)];
  }

}