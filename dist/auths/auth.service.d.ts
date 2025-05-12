import { CreateOnePersonDto } from 'src/people/dtos/create-one-person.dto';
import { HashProvider } from './providers/hash.provider';
import { PersonService } from 'src/people/person.service';
import { ConfigService } from '@nestjs/config';
import { TokenProvider } from './providers/token.provider';
import { LoginDto } from './dtos/login.dto';
export declare class AuthService {
    private readonly hashProvider;
    private readonly personServicce;
    private readonly configService;
    private readonly tokenProvider;
    constructor(hashProvider: HashProvider, personServicce: PersonService, configService: ConfigService, tokenProvider: TokenProvider);
    register(createOnePersonDto: CreateOnePersonDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    verifyAccessToken(token: string): Promise<object>;
}
