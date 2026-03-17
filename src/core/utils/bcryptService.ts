import bcrypt from "bcrypt";

export const bcryptService = {
  async generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  },
  async generateSalt(rounds: number) {
    const salt = bcrypt.genSaltSync(rounds || 10);
    return salt;
  },
  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
