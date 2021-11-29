import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Team } from '../entity/Team'

@injectable()
class TeamService extends CrudService<Team> {
  constructor(
  @inject(TYPES.TeamRepository) repository: Repository<Team>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created TeamService')
  }

  public async findById(id: string): Promise<Team | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress']
    })
    return result
  }

  public async findAll(): Promise<Array<Team>> {
    const result = await this.repository.find({
      relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress']
    })
    return result
  }
}

export { TeamService }
