import { PersonService } from './person.service';
import { UUID } from 'crypto';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
    getMyInFo(personId: UUID): Promise<import("./person.entity").Person>;
}
