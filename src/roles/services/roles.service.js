import {query} from "../../database/db.js";
import {
  DELETE_USERS_ROLES_BY_USER_ID, GET_ALL_ROLES_ID,
  GET_ROL_BY_ID,
  GET_ROLE_BY_ID,
  SET_ROL_TO_USER,
} from "../../database/queries/users.queries.js";
import {CustomError} from "../../config/errors/custom.error.js";

export class RoleService {

  constructor() { }

  async getRolById(id) {
    const { rows: role } = await query(GET_ROLE_BY_ID, [id]);
    return role;
  }

  async setRolesUser({userId, roles = []}) {

    await Promise.all(roles.map(rolId => {
      return query(SET_ROL_TO_USER, [userId, rolId]);
    }));

    const rolesAssigned = await Promise.all(roles.map(rolId => {
      return query(GET_ROL_BY_ID, [rolId]);
    }));

    return rolesAssigned.map(result => result.rows[0]);

  }

  async setRoleUser({userId, idRole}) {
    await query(SET_ROL_TO_USER, [userId, idRole]);
    return await this.getRolById(idRole);
  }

  async updatedRolesUser({userId, newRoles}) {

    await query(DELETE_USERS_ROLES_BY_USER_ID, [userId]);

    return await this.setRolesUser({userId, roles: newRoles});

  }

  async checkAllowedRoles({roles}) {
    const { rows: [{ rolesid }]} = await query(GET_ALL_ROLES_ID);

    const isContained = roles.every((role) => {
      return rolesid.includes(role);
    });

    if (!isContained)
      throw CustomError.badRequest(`Roles permitidos: [${rolesid}]`);

    return isContained;
  }

}