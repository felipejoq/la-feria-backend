import {PaginationDto} from "../../common/dtos/pagination.dto.js";
import {handleError} from "../../config/errors/handler.error.js";
import {LoginUserDto} from "../dtos/login-user.dto.js";
import {CustomError} from "../../config/errors/custom.error.js";
import {CreateUserDto} from "../dtos/create-user.dto.js";

export class UsersController {

  constructor(userService) {
    this.userService = userService;
  }

  getUsers = (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const [error, pagination] = PaginationDto.create({
      page: parseInt(page), limit: parseInt(limit)
    });

    if (error) return res.status(400).json({ error });

    this.userService.getUsers(pagination)
      .then(users => res.json(users))
      .catch(error => handleError(error, res));
  }

  getUserById = async (req, res) => {
    const { userId } = req.params;

    if (isNaN(+userId))
      return handleError(CustomError.badRequest("El id no es válido"), res);

    this.userService.getUserById({userId})
      .then(user => res.json(user))
      .catch(error => handleError(error, res));
  }

  registerUser = (req, res) => {
    const [error, createUserDto] = CreateUserDto.create({body: req.body});

    if (error)
      return handleError(CustomError.badRequest(error), res);

    this.userService.registerUser({createUserDto})
      .then(newUser => res.json(newUser))
      .catch(error => handleError(error, res));
  }

  loginUser = (req, res) => {
    const { email, password } = req.body;

    const [error, loginDto] = LoginUserDto.create({ email, password })

    if(error)
      return handleError(CustomError.badRequest(error), res);

    this.userService.loginUser({loginDto})
      .then(userLogin => res.json(userLogin))
      .catch(error => handleError(error, res));
  }

  updateUserById = (req, res) => {
    const { userId } = req.params;

    res.json({ message: `Este método actualiza un usuario por su id ${userId}` })
  }

  updateStatusUserById = (req, res) => {
    const { userId } = req.params;

    res.json({ message: `Este método actualiza el estado de un usuario por si id ${userId}` })
  }

  updateRolesUserById = (req, res) => {
    const { userId } = req.params;

    res.json({ message: `Este método actualiza los roles de un usuario por si id ${userId}` })
  }

  deleteUserById = (req, res) => {
    const { userId } = req.params;

    res.json({ message: `Este método elimina un usuario por su id ${userId}` })
  }

}