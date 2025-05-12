import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersonModule } from 'src/people/person.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashProvider } from './providers/hash.provider';
import { TokenProvider } from './providers/token.provider';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PersonModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
          issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
          audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    BcryptProvider,
    {
      provide: HashProvider,
      useClass: BcryptProvider,
    },
    TokenProvider,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
