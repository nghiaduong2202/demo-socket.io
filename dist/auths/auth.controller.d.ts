import { CreateOnePersonDto } from 'src/people/dtos/create-one-person.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createOnePersonDto: CreateOnePersonDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
}
