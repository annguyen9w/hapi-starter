import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { RaceResult } from '../entity/RaceResult'
import { NationalityType } from '../entity/Team'
import { RaceResultService } from '../service/race-result'

const raceResult:RaceResult = {
  id: '7d9be990-a86b-454f-ab8c-24443874b63e',
  raceNumber: '196',
  startPosition: 2,
  finishPosition: 3,
  race: {
    id: '13599db2-b244-4e44-8c27-b87301d41b7f',
    name: 'Le Mans'
  },
  car: {
    id: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5',
    make: 'Ferrari',
    model: '488 GTE-LM',
    class: {
      id: '12c67109-0130-477a-8528-a7538f9720f3',
      name: 'LM GTE AM'
    }
  },
  driver: {
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
    }
  },
  class: {
    id: '12c67109-0130-477a-8528-a7538f9720f3',
    name: 'LM GTE AM'
  }
}

describe('RaceResult Service', () => {
  const tags = (global as any).tags
  let raceResultService: RaceResultService
  let repository: Repository<RaceResult>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<RaceResult>()
    raceResultService = new RaceResultService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a raceResult ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => raceResult)
      const result = await raceResultService.findById(String(raceResult.id))
      expect(result).toBe(raceResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(raceResult.id)
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await raceResultService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(raceResultService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of results ${tags.positive}`, async () => {
      const results:RaceResult[] = [raceResult]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => results)
      const result = await raceResultService.findAll()
      expect(result).toBe(results)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should return empty an array of results ${tags.positive}`, async () => {
      const results:RaceResult[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => results)
      const result = await raceResultService.findAll()
      expect(result).toBe(results)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(raceResultService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })
  })

  describe(`findByQuery ${tags.read}`, () => {
    it(`should return an array of results ${tags.positive}`, async () => {
      const results:RaceResult[] = [raceResult]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => results)
      const result = await raceResultService.findByQuery({ race: '13599db2-b244-4e44-8c27-b87301d41b7f' })
      expect(result).toBe(results)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { race: '13599db2-b244-4e44-8c27-b87301d41b7f' },
        relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
      })
    })

    it(`should return empty an array of results ${tags.positive}`, async () => {
      const results:RaceResult[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => results)
      const result = await raceResultService.findByQuery({
        race: '13599db2-b244-4e44-8c27-b87301d41b7f',
        car: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5',
        driver: '33b66b5a-2e04-489e-a762-764c5928f30e'
      })
      expect(result).toBe(results)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: {
          race: '13599db2-b244-4e44-8c27-b87301d41b7f',
          car: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5',
          driver: '33b66b5a-2e04-489e-a762-764c5928f30e'
        },
        relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
      })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(raceResultService.findByQuery({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: {},
        relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
      })
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a raceResult (create) ${tags.positive}`, async () => {
      const resultWithoutId:RaceResult = raceResult
      delete resultWithoutId.id
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => resultWithoutId)
      const result = await raceResultService.save(raceResult)
      expect(result).toBe(resultWithoutId)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(raceResult)
    })

    it(`should return a raceResult (update) ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => raceResult)
      const result = await raceResultService.save(raceResult)
      expect(result).toBe(raceResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(raceResult)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(raceResultService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const raceResultId = '7d9be990-a86b-454f-ab8c-24443874b63e'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await raceResultService.delete(raceResultId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(raceResultId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(raceResultService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
