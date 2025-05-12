import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreateOnePersonDto } from './dtos/create-one-person.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonService {
  constructor(
    /**
     * inject PersonRepository
     */
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  public async createOne(createOnePersonDto: CreateOnePersonDto) {
    const person = this.personRepository.create(createOnePersonDto);

    try {
      await this.personRepository.save(person);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return person;
  }

  public async findOneByEmail(email: string) {
    return this.personRepository
      .findOneOrFail({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new NotFoundException('Not found the person');
      });
  }

  public async findOneById(personId: UUID) {
    return this.personRepository
      .findOneOrFail({
        where: {
          id: personId,
        },
      })
      .catch(() => {
        throw new NotFoundException('Not found the person');
      });
  }
}
