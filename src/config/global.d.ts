import IUser from "../types/interfaces/users/user-interface";

declare global {
  namespace Express {
    interface Request {
      authUser: IUser;
      [key: string]: string;
    }
  }
}
