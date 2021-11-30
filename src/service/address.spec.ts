import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Address } from '../entity/Address'
import { AddressService } from '../service/address'

describe('Address Service', () => {
  const tags = (global as any).tags
  let addressService: AddressService
  let repository: Repository<Address>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Address>()
    addressService = new AddressService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return an address ${tags.positive}`, async () => {
      const address:Address = { id: '224da07b-695a-4946-a776-1d216594dbcd', city: 'Lake Dallas', state: 'Texas', zipcode: '76065', country: 'United States' }
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => address)
      const result = await addressService.findById(String(address.id))
      expect(result).toBe(address)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(address.id)
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await addressService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(addressService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of addresses ${tags.positive}`, async () => {
      const addresses:Address[] = [
        { id: '0d775ebe-c1e3-4009-8719-2842297987e2', street: '2476 Margaret Street', city: '	Houston', state: 'Texas', zipcode: '77026', country: 'United States' },
        { id: '18037b8f-b0a2-4471-a4aa-dcaca2fb6e32', street: '25 Nguyễn Đình Chiểu', street2: '4 Đoàn Trần Nghiệp', city: 'Nha Trang', state: 'Khánh Hòa', zipcode: '65000', country: 'Viet Nam' },
        { id: '224da07b-695a-4946-a776-1d216594dbcd', city: 'Lake Dallas', state: 'Texas', zipcode: '76065', country: 'United States' }
      ]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => addresses)
      const result = await addressService.findAll()
      expect(result).toBe(addresses)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should return empty an array of addresses ${tags.positive}`, async () => {
      const addresses:Address[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => addresses)
      const result = await addressService.findAll()
      expect(result).toBe(addresses)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(addressService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a address (create) ${tags.positive}`, async () => {
      const address:Address = {
        street: '25 Nguyễn Đình Chiểu',
        street2: '4 Đoàn Trần Nghiệp',
        city: 'Nha Trang',
        state: 'Khánh Hòa',
        zipcode: '65000',
        country: 'Viet Nam'
      }
      const addressWithId:Address = {
        id: '18037b8f-b0a2-4471-a4aa-dcaca2fb6e32',
        ...address
      }
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => addressWithId)
      const result = await addressService.save(address)
      expect(result).toBe(addressWithId)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(address)
    })

    it(`should return a address (update) ${tags.positive}`, async () => {
      const address:Address = {
        id: '0d775ebe-c1e3-4009-8719-2842297987e2',
        street: '2476 Margaret Street',
        street2: '',
        city: 'Houston',
        state: 'Texas',
        zipcode: '77026',
        country: 'United States'
      }
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => address)
      const result = await addressService.save(address)
      expect(result).toBe(address)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(address)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(addressService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const addressId = '18037b8f-b0a2-4471-a4aa-dcaca2fb6e32'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await addressService.delete(addressId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(addressId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(addressService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
