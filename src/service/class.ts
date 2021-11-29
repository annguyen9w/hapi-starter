import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Class } from '../entity/Class'

@injectable()
class ClassService extends CrudService<Class> {
  constructor(
  @inject(TYPES.ClassRepository) repository: Repository<Class>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created ClassService')
  }

  public async findByIds(ids: Class[]): Promise<Array<Class>> {
    const result = await this.repository.findByIds(ids)
    return result
  }
}

export { ClassService }
