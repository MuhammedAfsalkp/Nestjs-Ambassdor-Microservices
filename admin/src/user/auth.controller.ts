import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    Logger,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { RegisterDto } from "./dtos/register.dto";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { AuthGuard } from "./auth.guard";
import { User } from './user.decorator';


const ControllerLogger = new Logger('AuthController');

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private userService: UserService,
    ) {
    }

    @Post('register')
    async register(
        @Body() body: RegisterDto,
        @Req() request: Request
    ) {

        ControllerLogger.log('registering user....');
        const response = await this.userService.post('register', {
            ...body,
            is_ambassador: false
        })
        ControllerLogger.log('registration completed');

        return response;
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request
    ) {

        ControllerLogger.log('Logging user.............')
        const resp = await this.userService.post('login', {
            email,
            password,
            scope : 'admin'
        })
        ControllerLogger.log('login completed...............',resp, 'resp')
        response.cookie('jwt', resp['jwt'], { httpOnly: true });

        return {
            message: 'success',
        };
    }

    @Get('user')
    async user(@User() user,) {
        ControllerLogger.log('Getting user.............', user)
        ControllerLogger.log('Got user')
        return user;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
        const cookie = request.cookies['jwt'];

        Logger.log('Logging out user.....', cookie);
        await this.userService.post('logout', {}, cookie)
        Logger.log('Logged out');

        return {
            message: 'success'
        }
    }

    @UseGuards(AuthGuard)
    @Put('users/info')
    async updateInfo(
        @Req() request: Request,
        @Body('first_name') first_name: string,
        @Body('last_name') last_name: string,
        @Body('email') email: string,
    ) {
        const cookie = request.cookies['jwt'];

        Logger.log('Updating user info...', cookie)
        const res = await this.userService.put('users/info', {
            first_name,
            last_name,
            email
        }, cookie)
        Logger.log('updated')

        return res;
    }

    @UseGuards(AuthGuard)
    @Put('users/password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string,
    ) {

        const cookie = request.cookies['jwt'];

        Logger.log('Updating user password...', cookie)
        const res = await this.userService.put('users/password', {
            password,
            password_confirm
        }, cookie)
        Logger.log('updated password successfully')

        return res;
    }
}
