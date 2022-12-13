import IUser from "../types/interfaces/users/user-interface";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      [key: string]: string;
    }
  }
}
