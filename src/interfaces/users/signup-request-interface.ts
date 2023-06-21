import { Role } from '../../enums/role-enum';

export default interface ISignupRequest {
  email: string;
  password: string;
  role: Role;
}
