import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreateOnePersonDto } from './dtos/create-one-person.dto';
import { UUID } from 'crypto';
export declare class PersonService {
    private readonly personRepository;
    constructor(personRepository: Repository<Person>);
    createOne(createOnePersonDto: CreateOnePersonDto): Promise<Person>;
    findOneByEmail(email: string): Promise<Person>;
    findOneById(personId: UUID): Promise<Person>;
}
