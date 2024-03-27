import {CanActivate, ExecutionContext, Injectable, Logger, NotFoundException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import { TokenService } from "./token.service";
import { MoreThanOrEqual } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private tokenService: TokenService) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        try {
            console.log('Auth guard')
            const jwt = request.cookies['jwt'];
            console.log(jwt, 'Recieved Jwt')
            const {id } = await this.jwtService.verify(jwt);

            const userToken = await this.tokenService.findOne({
                where: {
                    user_id: id,
                    expired_at: MoreThanOrEqual(new Date())
                }
            })
            if(!userToken){
                throw new NotFoundException('User token not found');
                return false;
            }
            Logger.log('recieved  userToken', userToken)
            return true;
        } catch (e) {
            return false;
        }
    }
}
