import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Driver, NationalityType } from '../entity/Driver'
import { DriverService } from '../service/driver'

const driver:Driver = {
  id: '33b66b5a-2e04-489e-a762-764c5928f30e',
  firstName: 'An',
  lastName: 'Nguyễn',
  nationality: 'Viet Nam' as NationalityType,
  homeAddress: {
    id: '0d775ebe-c1e3-4009-8719-2842297987e2',
    street: 'số 5 Phạm Văn Đồng',
    street2: '',
    city: 'Nha Trang',
    state: 'Khánh Hòa',
    zipcode: '65000',
    country: 'Việt Nam'
  },
  teams: [{
    id: '58a54b0a-dfd5-45fd-8752-8702637a0eb9',
    name: 'TOYOTA GAZOO RACING',
    nationality: 'USA' as NationalityType
  }]
}

describe('Driver Service', () => {
  const tags = (global as any).tags
  let driverService: DriverService
  let repository: Repository<Driver>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Driver>()
    driverService = new DriverService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a driver ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => driver)
      const result = await driverService.findById(String(driver.id))
      expect(result).toBe(driver)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: driver.id },
        relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress']
      })
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await driverService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: '' },
        relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress']
      })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(driverService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: '' },
        relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress']
      })
    })
  })

  describe(`findByIds ${tags.read}`, () => {
    it(`should return an array of drivers ${tags.positive}`, async () => {
      const drivers:Driver[] = [driver]
      const mockRepository = jest.spyOn(repository, 'findByIds').mockImplementation(async () => drivers)
      const result = await driverService.findByIds(drivers.map(c => ({ id: c.id })))
      expect(result).toBe(drivers)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(drivers.map(c => ({ id: c.id })))
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findByIds').mockImplementation(() => { throw Error('error') })
      await expect(driverService.findByIds([])).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith([])
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of drivers ${tags.positive}`, async () => {
      const drivers:Driver[] = [driver]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => drivers)
      const result = await driverService.findAll()
      expect(result).toBe(drivers)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress'] })
    })

    it(`should return empty an array of drivers ${tags.positive}`, async () => {
      const drivers:Driver[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => drivers)
      const result = await driverService.findAll()
      expect(result).toBe(drivers)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress'] })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(driverService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['homeAddress', 'managementAddress', 'teams', 'teams.businessAddress'] })
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a driver (create) ${tags.positive}`, async () => {
      const driverWithoutId:Driver = driver
      delete driverWithoutId.id
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => driverWithoutId)
      const result = await driverService.save(driver)
      expect(result).toBe(driverWithoutId)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(driver)
    })

    it(`should return a driver (update) ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => driver)
      const result = await driverService.save(driver)
      expect(result).toBe(driver)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(driver)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(driverService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const driverId = '33b66b5a-2e04-489e-a762-764c5928f30e'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await driverService.delete(driverId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(driverId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(driverService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
