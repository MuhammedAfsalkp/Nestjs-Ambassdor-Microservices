import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { UserService } from "./user.service";

const logger = new Logger('AuthGuardLogger')
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        try {
            logger.log('Auth guard');
            const user = await this.userService.get(`user/ambassador`, request.cookies['jwt']);
            logger.log('User', user);
            if (!user) return false;
            return true
        } catch (e) {
            return false;
        }
    }
}
