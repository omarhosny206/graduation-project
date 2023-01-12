import { ALL_ROLES, Role } from '../enums/role-enum';

export const check = (role: Role, allowedRoles: Role[] = ALL_ROLES): boolean => {
    const exists: boolean = allowedRoles.includes(role);
    return exists;
};
