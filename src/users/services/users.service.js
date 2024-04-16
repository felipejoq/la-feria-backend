import {
  CREATE_USER,
  DELETE_USER_BY_ID,
  GET_USER_BY_EMAIL_WITH_ROLES,
  GET_USER_BY_ID_WITH_ROLES,
  GET_USERS_AND_ROLES_PAGINATE,
  UPDATE_STATUS_USER_BY_ID,
  UPDATE_USER_BY_ID
} from "../../database/queries/users.queries.js";
import {GET_TOTAL_USERS_FROM_CONFIG, IS_REGISTRATION_ACTIVE} from "../../database/queries/config.queries.js";
import {query} from "../../database/db.js";
import {CustomError} from "../../config/errors/custom.error.js";
import {Encoder} from "../../config/plugins/encoder.js";
import {JwtPlugin} from "../../config/plugins/jwt.js";
import {User} from "../models/User.js";
import {getResultsWithPagination} from "../../config/utils/results-with-pagination.js";

export class UserService {
  constructor(rolesService) {
    this.rolesService = rolesService;
  }

  async getUsers({page, limit}) {

    const [usersResult, {rows: [{total_users}]}] = await Promise.all([
      query(GET_USERS_AND_ROLES_PAGINATE, [(page - 1) * limit, limit]),
      query(GET_TOTAL_USERS_FROM_CONFIG)
    ]);

    const users = usersResult?.rows;
    const total = parseInt(total_users);

    return getResultsWithPagination({
      source: "users",
      data: users,
      total,
      page,
      limit
    });
  }

  async getUserById({userId}) {
    const {rows: [user]} = await query(GET_USER_BY_ID_WITH_ROLES, [userId]);

    if (!user)
      throw CustomError.notFound('El usuario no existe');

    return user;
  }

  async getUserByEmail({email}) {
    const result = await query(GET_USER_BY_EMAIL_WITH_ROLES, [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user)
      throw CustomError.notFound('El usuario no existe o el email no es válido');

    return user;
  }

  async updateUserById({userId, updateUserDto}) {
    const user = this.getUserById({userId});
    if (!user) throw CustomError.notFound('El usuario no existe');

    const {rows: [userUpdated]} = await query(UPDATE_USER_BY_ID, [updateUserDto.name, updateUserDto.email, updateUserDto.active, userId]);

    return userUpdated;
  }

  async deleteUserById({userId}) {
    const user = this.getUserById({userId});

    const {rows: [userDeleted]} = await query(DELETE_USER_BY_ID, [userId]);

    return userDeleted;
  }

  async loginUser({loginDto}) {
    const {email, password} = loginDto;
    const user = await this.getUserByEmail({email});
    if (!user) throw CustomError.badRequest('Email or Password are not valid');

    if (!user.active)
      throw CustomError.forbidden('Usuario inactivo.');

    const isMatching = await Encoder.compareHash({str: password, hash: user.password});
    if (!isMatching) throw CustomError.badRequest('Email or Password are not valid');

    delete user.password;

    const payload = {email: user.email};

    const token = await JwtPlugin.generateToken({payload});
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      ...user,
      token,
    }
  }

  async registerUser({createUserDto}) {

    const {rows: [{enable_registration}]} = await query(IS_REGISTRATION_ACTIVE);

    if (!enable_registration)
      throw CustomError.unauthorized('Los nuevos registros están desactivados');

    await this.rolesService.checkAllowedRoles({roles: createUserDto.roles});
    const {rows: exists} = await query(GET_USER_BY_EMAIL_WITH_ROLES, [createUserDto.email]);

    if (exists.length > 0)
      throw CustomError.badRequest('Usuario ya existe');

    createUserDto.password = await Encoder.getHash({str: createUserDto.password});

    const newUser = new User(createUserDto);
    const {name, email, password, roles} = newUser;
    const {rows: [user]} = await query(CREATE_USER, [name, email.toLowerCase(), password]);
    const rolesUser = await this.rolesService.setRoleUser({userId: user.id, idRole: roles[0]});

    delete user.password;
    user.roles = rolesUser;

    const payload = {email: user.email};
    const token = await JwtPlugin.generateToken({payload});
    if (!token)
      throw CustomError.internalServer('Error while creating JWT');

    return {
      ...user,
      token
    };
  }

  async updateStatusUserById({userId}) {
    const user = await this.getUserById({userId});
    if (!user) throw CustomError.notFound('El usuario no existe');

    const {rows: [userUpdated]} = await query(UPDATE_STATUS_USER_BY_ID, [!user.active, user.id]);

    return userUpdated;
  }

  async updateRolesUserById({userId, roles}) {
    const user = await this.getUserById({userId});
    if (!user) throw CustomError.notFound('El usuario no existe');

    await this.rolesService.checkAllowedRoles({roles});
    const rolesUser = await this.rolesService.updatedRolesUser({userId, newRoles: roles});

    delete user.password;
    user.roles = rolesUser;

    return user;
  }

}