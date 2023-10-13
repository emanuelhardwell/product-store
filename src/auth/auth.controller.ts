import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDecorator } from './decorators/get-user.decorator';
import { RawHeadersDecorator } from './decorators/raw-headers.decorators';
import { IncomingHttpHeaders } from 'http';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUserDecorator() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request, ## NO se debe sacar la INFO directamente del REQUEST, (se debe crear un Decorador)
    @GetUserDecorator() user: User,
    @GetUserDecorator('email') emailUser: string,
    @RawHeadersDecorator() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request.user);
    // console.log(emailUser);

    return {
      ok: true,
      message: 'successfully !',
      code: 200,
      user,
      emailUser,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-admin']) //SetMetadata: ya NO se recomienda usar porque no podemos equivocar facilmente en el MetadataKey
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteWithCustomGuard(@GetUserDecorator() user: User) {
    return {
      ok: true,
      msg: 'successfully',
      user,
    };
  }

  @Get('private3')
  //@SetMetadata('roles', ['admin', 'super-admin']) //SetMetadata: ya NO se recomienda usar porque no podemos equivocar facilmente en el MetadataKey
  @RoleProtected(validRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteWithCustomGuardAndDecorator(
    @GetUserDecorator() user: User,
  ) {
    return {
      ok: true,
      msg: 'successfully',
      user,
    };
  }

  @Get('private4')
  @Auth(validRoles.user)
  privateRouteWithCustomGuardAndDecorator(@GetUserDecorator() user: User) {
    return {
      ok: true,
      msg: 'successfully',
      user,
    };
  }
}
