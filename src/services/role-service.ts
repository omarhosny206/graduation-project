import { Role } from '../enums/role-enum';
import { ALL_ROLES } from '../utils/all-roles';

export function check(role: Role, allowedRoles: Role[] = ALL_ROLES): boolean {
    const exists: boolean = allowedRoles.includes(role);
    return exists;
}
