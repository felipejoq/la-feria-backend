import bcrypt from "bcrypt";

export class Encoder {

  static async getHash({str}){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(str, salt);
  }

  static async compareHash({str, hash}){
    return bcrypt.compareSync(str, hash)
  }

}