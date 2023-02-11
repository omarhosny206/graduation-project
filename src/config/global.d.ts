import IUser from '../interfaces/users/user-interface';

declare global {
  namespace Express {
    interface Request {
      authenticatedUser: any;
      [key: string]: string;
    }
  }
}
