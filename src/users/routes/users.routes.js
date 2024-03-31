import {Router} from "express";
import {UsersController} from "../controllers/user.controller.js";
import {UserService} from "../services/users.service.js";
import {RoleService} from "../../roles/services/roles.service.js";

export class UsersRoutes {

  static get routes() {

    const usersRouter = Router();
    const rolesServices = new RoleService();
    const userService = new UserService(rolesServices);
    const usersController = new UsersController(userService);

    usersRouter.get('/', usersController.getUsers);
    usersRouter.get('/:userId', usersController.getUserById);
    usersRouter.delete('/:userId', usersController.deleteUserById);
    usersRouter.put('/:userId', usersController.updateUserById);
    usersRouter.post('/login', usersController.loginUser);
    usersRouter.post('/register', usersController.registerUser);
    usersRouter.put('/roles/:userId', usersController.updateRolesUserById);
    usersRouter.put('/status/:userId', usersController.updateStatusUserById);

    return usersRouter;
  }

}