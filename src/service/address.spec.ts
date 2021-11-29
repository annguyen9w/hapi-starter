import { Repository } from 'typeorm'
import * as Winston from 'winston'
import { Address } from '../entity/Address'
import { AddressService } from '../service/address'

describe('Address Service', () => {
  let addressService: AddressService
  let repository: Repository<Address>
  const result = [] as Address[]

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Address>()
    addressService = new AddressService(repository, logger)
  })

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const mockRepositoryResult = jest.spyOn(repository, 'find').mockImplementation(async () => result)
      const addresses = await addressService.findAll()
      expect(addresses).toBe(result)
      expect(mockRepositoryResult).toHaveBeenCalledTimes(1)
    })

    it('should save address success', async () => {
      const mockRepositoryResult = jest.spyOn(repository, 'save').mockImplementation()
      const addresses = await addressService.save({})
      expect(addresses).toBe(undefined)
      expect(mockRepositoryResult).toHaveBeenCalledTimes(1)
    })
  })
})
