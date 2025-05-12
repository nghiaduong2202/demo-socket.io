import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOnePersonDto } from 'src/people/dtos/create-one-person.dto';
import { HashProvider } from './providers/hash.provider';
import { PersonService } from 'src/people/person.service';
import { ConfigService } from '@nestjs/config';
import { TokenProvider } from './providers/token.provider';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * inject HashProvider
     */
    private readonly hashProvider: HashProvider,
    /**
     * inject PersonService
     */
    private readonly personServicce: PersonService,
    /**
     * inject ConfigService
     */
    private readonly configService: ConfigService,
    /**
     * inject TokenProvider
     */
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async register(createOnePersonDto: CreateOnePersonDto) {
    createOnePersonDto.password = await this.hashProvider.hashPassword(
      createOnePersonDto.password,
    );

    const person = await this.personServicce.createOne(createOnePersonDto);

    const payload = {
      role: 'user',
    };

    const token = await this.tokenProvider.generate(
      person.id,
      this.configService.get<string>('JWT_SECRET')!,
      this.configService.get<string>('JWT_EXPIRE')!,
      payload,
    );

    return {
      token,
    };
  }

  public async login(loginDto: LoginDto) {
    const person = await this.personServicce.findOneByEmail(loginDto.email);

    const isEqual = await this.hashProvider.comparePassword(
      loginDto.password,
      person.password,
    );

    if (!isEqual) {
      throw new ForbiddenException('Email or password fail');
    }

    const payload = {
      role: 'user',
    };

    const token = await this.tokenProvider.generate(
      person.id,
      this.configService.get<string>('JWT_SECRET')!,
      this.configService.get<string>('JWT_EXPIRE')!,
      payload,
    );

    return {
      token,
    };
  }

  public async verifyAccessToken(token: string) {
    return this.tokenProvider.verify(
      token,
      this.configService.get<string>('JWT_SECRET')!,
    );
  }
}
