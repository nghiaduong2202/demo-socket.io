import { Controller, Get } from '@nestjs/common';
import { PersonService } from './person.service';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { UUID } from 'crypto';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';

@Controller('api/person')
export class PersonController {
  constructor(
    /**
     * inject PersonService
     */
    private readonly personService: PersonService,
  ) {}

  @Get('my-info')
  @AuthRoles(AuthRoleEnum.USER)
  public getMyInFo(@ActivePerson('sub') personId: UUID) {
    return this.personService.findOneById(personId);
  }
}
