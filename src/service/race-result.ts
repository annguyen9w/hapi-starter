import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { RaceResult } from '../entity/RaceResult'

@injectable()
class RaceResultService extends CrudService<RaceResult> {
  constructor(
  @inject(TYPES.RaceResultRepository) repository: Repository<RaceResult>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created RaceResultService')
  }

  public async findByQuery(where: object): Promise<Array<RaceResult>> {
    const result = await this.repository.find({
      where,
      relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
    })
    return result
  }
}

export { RaceResultService }
