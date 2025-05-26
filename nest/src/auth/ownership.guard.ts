import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class OwnershipGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const paramId = parseInt(request.params.id || request.params.userId);
  
      if (user?.id !== paramId) {
        throw new UnauthorizedException(
          'You do not have access to other users data. Please use your own user ID.',
        );
      }
      return true;
    }
  }
  