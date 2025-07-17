import jwt from "jsonwebtoken";
import { IUserDocument } from "../user/user.model";
import { JWT_SECRET } from "../../constants/env_variables";
import { IUserTokenPayload } from "./authentication.types";
import bcrypt from "bcrypt";
import { JWT_EXPIRY } from "../../constants/constants";

export default class AuthService {
  // Generate JWT access token
  generateAccessToken(user: IUserDocument): string {
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  // Verify JWT access token
  verifyAccessToken(token: string): IUserTokenPayload | null {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as IUserTokenPayload;
  }

  async createPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
