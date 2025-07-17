import { UserModel } from "./user.model";
import { IUser } from "./user.types";

class UserService {
  async findUserByEmailOrUserName(email?: string, username?: string) {
    return await UserModel.findOne({
      $or: [{ email }, { username }],
    });
  }

  async createNewUser(userDetails: Omit<IUser, "_id">) {
    const user = new UserModel(userDetails);
    return await user.save();
  }
}

export default UserService;
