import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtAuthGuard } from './auth.guard';
import { MembershipService } from '../memberships/memberships.service';

@Injectable()
export class PremiumUserGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService) private usersService: UserService,
    @Inject(MembershipService) private membershipService: MembershipService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: number = request.user.id;
    return await this.usersService.isMember(userId);
  }
}
