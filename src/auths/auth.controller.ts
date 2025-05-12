import { Body, Controller, Post } from '@nestjs/common';
import { CreateOnePersonDto } from 'src/people/dtos/create-one-person.dto';
import { AuthRoles } from './decorators/auth-role.decorator';
import { AuthRoleEnum } from './enums/auth-role.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('api/auth')
@AuthRoles(AuthRoleEnum.NONE)
export class AuthController {
  constructor(
    /**
     * inject AuthService
     */
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  public register(@Body() createOnePersonDto: CreateOnePersonDto) {
    return this.authService.register(createOnePersonDto);
  }

  @Post('login')
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
