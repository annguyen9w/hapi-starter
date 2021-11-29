import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Driver } from '../entity/Driver'

@injectable()
class DriverService extends CrudService<Driver> {
  constructor(
  @inject(TYPES.DriverRepository) repository: Repository<Driver>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created DriverService')
  }

  public async findById(id: string): Promise<Driver | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress']
    })
    return result
  }

  public async findByIds(ids: Driver[]): Promise<Array<Driver>> {
    const result = await this.repository.findByIds(ids)
    return result
  }

  public async findAll(): Promise<Array<Driver>> {
    const result = await this.repository.find({ relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress'] })
    return result
  }
}

export { DriverService }
