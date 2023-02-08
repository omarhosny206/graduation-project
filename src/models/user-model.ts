import { model, Schema } from "mongoose";
import IUser from "../interfaces/users/user-interface";
import { ALL_ROLES } from "../utils/all-roles";


const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, minlength: 8, required: true },
    role: { type: String, required: true, enum: ALL_ROLES },
    info: {type: Schema.Types.ObjectId, ref: 'UserInfo', required: false },
  },
  {
    versionKey: false,
  }
);

const UserModel = model<IUser>("User", userSchema);
export default UserModel;