import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Race } from '../entity/Race'

@injectable()
class RaceService extends CrudService<Race> {
  constructor(
  @inject(TYPES.RaceRepository) repository: Repository<Race>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created RaceService')
  }
}

export { RaceService }
