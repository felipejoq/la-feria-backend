import {JwtPlugin} from "../../config/plugins/jwt.js";
import {Encoder} from "../../config/plugins/encoder.js";
import {UserService} from "../services/users.service.js";

export class AuthMiddleware {

  constructor() {
  }

  static async validateJWT(req, res, next) {

    const userService = new UserService(new Encoder());

    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({error: 'No token provided'});
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer token'});

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtPlugin.validateToken({token});
      if (!payload) return res.status(401).json({error: 'El token no es válido'})

      const user = await userService.getUserByEmail({email: payload.email});
      delete user.password

      if (!user) return res.status(401).json({error: 'El token no es válido'});

      req.body.user = user;

      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: 'Internal server error'});
    }

  }

}