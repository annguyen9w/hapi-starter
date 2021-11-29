import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Address } from '../entity/Address'

@injectable()
class AddressService extends CrudService<Address> {
  constructor(
  @inject(TYPES.AddressRepository) repository: Repository<Address>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created AddressService')
  }
}

export { AddressService }
