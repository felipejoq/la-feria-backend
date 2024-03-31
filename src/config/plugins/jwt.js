import jwt from 'jsonwebtoken';
import {envs} from './envs.js';

const JWT_SEED = envs.JWT_SEED;

export class JwtPlugin {

  static async generateToken({payload, duration = '2h'}) {

    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, {expiresIn: duration}, (err, token) => {
        console.log(err)
        if (err)
          return resolve(null);

        resolve(token);
      });
    })
  }

  static async validateToken({token}) {

    return new Promise((resolve) => {

      jwt.verify(token, JWT_SEED, (err, decoded) => {

        if (err) return resolve(null);

        resolve(decoded);
      });

    })
  }

}