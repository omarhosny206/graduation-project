import IUser from '../interfaces/users/user-interface';
import { AuthenticatedUser } from '../utils/authenticated-user-type';

declare global {
  namespace Express {
    interface Request {
      authenticatedUser: AuthenticatedUser;
      [key: string]: string;
    }
  }
}
