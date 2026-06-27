import type { NextFunction, Request, Response } from 'express';
import type { Permission, Role, User } from '../shared/types.js';
import { store } from './store.js';

export interface AuthenticatedRequest extends Request {
  currentUser: User;
  currentRole: Role;
}

function resolveUser(req: Request) {
  const requestedUserId = req.header('x-user-id');
  return (requestedUserId && store.getUser(requestedUserId)) || store.getDefaultUser();
}

export function attachCurrentUser(req: Request, res: Response, next: NextFunction) {
  const user = resolveUser(req);
  const role = store.getRole(user.roleId);

  if (!role) {
    res.status(500).json({ error: 'Current user has no valid role assignment.' });
    return;
  }

  (req as AuthenticatedRequest).currentUser = user;
  (req as AuthenticatedRequest).currentRole = role;
  next();
}

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as AuthenticatedRequest).currentRole;

    if (!role.permissions.includes(permission)) {
      res.status(403).json({
        error: 'You do not have permission to perform this action.',
        requiredPermission: permission
      });
      return;
    }

    next();
  };
}
