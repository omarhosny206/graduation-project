import IUser from "../types/interfaces/users/user-interface";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser: IUser;
      [key: string]: string;
    }
  }
}
