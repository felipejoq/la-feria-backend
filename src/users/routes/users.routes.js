import {Router} from "express";
import {UsersController} from "../controllers/user.controller.js";
import {UserService} from "../services/users.service.js";
import {RoleService} from "../../roles/services/roles.service.js";
import {AuthMiddleware} from "../middlewares/auth.middleware.js";
import {RoleMiddleware} from "../../middlewares/role.middleware.js";

export class UsersRoutes {

  static get routes() {

    const usersRouter = Router();
    const rolesServices = new RoleService();
    const userService = new UserService(rolesServices);
    const usersController = new UsersController(userService);

    const {validateJWT} = AuthMiddleware;
    const {validRoles} = RoleMiddleware;

    usersRouter.get('/', [validateJWT, validRoles([1])], usersController.getUsers);
    usersRouter.get('/:userId', usersController.getUserById);
    usersRouter.delete('/:userId', [validateJWT, validRoles([1])], usersController.deleteUserById);
    usersRouter.put('/:userId', usersController.updateUserById);
    usersRouter.post('/login', usersController.loginUser);
    usersRouter.post('/register', usersController.registerUser);
    usersRouter.put('/roles/:userId', [validateJWT, validRoles([1])], usersController.updateRolesUserById);
    usersRouter.put('/status/:userId', [validateJWT, validRoles([1])], usersController.updateStatusUserById);

    return usersRouter;
  }

}