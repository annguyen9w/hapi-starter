import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository, Like } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Car } from '../entity/Car'
import { CarQueryDTO } from '../dto/car'

@injectable()
class CarService extends CrudService<Car> {
  constructor(
  @inject(TYPES.CarRepository) repository: Repository<Car>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created CarService')
  }

  public async findById(id: string): Promise<Car | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['class', 'team', 'team.businessAddress']
    })
    return result
  }

  public async findAllByQuery(query: CarQueryDTO): Promise<Array<Car>> {
    const whereObj: CarQueryDTO = {}
    if (query.make) {
      whereObj.make = Like(`%${query.make}%`)
    }
    if (query.model) {
      whereObj.model = Like(`%${query.model}%`)
    }
    const result = await this.repository.find({
      where: whereObj,
      relations: ['class', 'team', 'team.businessAddress']
    })
    return result
  }
}

export { CarService }
