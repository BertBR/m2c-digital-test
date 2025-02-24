import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ExpressRequestWithPermission } from '../types/index';

@Injectable()
export class PermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params, path, method } = context.switchToHttp().
      getRequest<ExpressRequestWithPermission>();

    if (user.isAdmin) {
      return true;
    }

    if (path.includes('company') && !user.isAdmin) {
      throw new ForbiddenException('Only admin can access this route');
    }

    if (path.includes('campaign') && method === 'DELETE' && !user.isAdmin) {
      throw new ForbiddenException('Only admin can delete campaigns');
    }

    if (params.email && params.email !== user.email) {
      throw new ForbiddenException('You can only get your own user');
    }

    return true;

  }
}
