import { injectable } from 'inversify'
import { Logger } from 'winston'
import { DeleteResult, Repository } from 'typeorm'

@injectable()
class CrudService<T> {

  constructor(protected repository: Repository<T>, protected logger: Logger) { }

  public async findById(id: string): Promise<T | undefined> {
    const result = await this.repository.findOne(id)
    return result
  }

  public async findAll(): Promise<Array<T>> {
    const result = await this.repository.find()
    return result
  }

  public async save(entity: T): Promise<T | undefined> {
    const result = await this.repository.save(entity)
    return result
  }

  public async delete(id: string): Promise<DeleteResult> {
    const result = await this.repository.delete(id)
    return result
  }
}

export { CrudService }