import { DeleteResult, Repository, Like } from 'typeorm'
import * as Winston from 'winston'
import { Car } from '../entity/Car'
import { NationalityType } from '../entity/Team'
import { CarService } from '../service/car'

const car:Car = {
  id: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5',
  make: 'Ferrari',
  model: '488 GTE-LM',
  class: {
    id: '12c67109-0130-477a-8528-a7538f9720f3',
    name: 'LM GTE AM'
  },
  team: {
    id: '58a54b0a-dfd5-45fd-8752-8702637a0eb9',
    name: 'TOYOTA GAZOO RACING',
    nationality: 'USA' as NationalityType
  }
}

describe('Car Service', () => {
  const tags = (global as any).tags
  let carService: CarService
  let repository: Repository<Car>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Car>()
    carService = new CarService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a car ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => car)
      const result = await carService.findById(String(car.id))
      expect(result).toBe(car)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: { id: car.id }
      })
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await carService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: { id: '' }
      })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(carService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: { id: '' }
      })
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of cars ${tags.positive}`, async () => {
      const cars:Car[] = [car]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => cars)
      const result = await carService.findAll()
      expect(result).toBe(cars)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should return empty an array of cars ${tags.positive}`, async () => {
      const cars:Car[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => cars)
      const result = await carService.findAll()
      expect(result).toBe(cars)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(carService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })
  })

  describe(`findAllByQuery ${tags.read}`, () => {
    it(`should return an array of cars with query make ${tags.positive}`, async () => {
      const cars:Car[] = [car]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => cars)
      const result = await carService.findAllByQuery({ make: 'Ferrari' })
      expect(result).toBe(cars)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: { make: Like('%Ferrari%') }
      })
    })

    it(`should return an array of cars with query model ${tags.positive}`, async () => {
      const cars:Car[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => cars)
      const result = await carService.findAllByQuery({ model: '488 GTE-LM' })
      expect(result).toBe(cars)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: { model: Like('%488 GTE-LM%') }
      })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(carService.findAllByQuery({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        relations: ['class', 'team', 'team.businessAddress'],
        where: {}
      })
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a car (create) ${tags.positive}`, async () => {
      const carPayload:Car = {
        make: 'Ferrari',
        model: '488 GTE-LM',
        class: {
          id: '12c67109-0130-477a-8528-a7538f9720f3',
          name: 'LM GTE AM'
        },
        team: {
          id: '58a54b0a-dfd5-45fd-8752-8702637a0eb9',
          name: 'TOYOTA GAZOO RACING',
          nationality: 'USA' as NationalityType
        }
      }
      const carMockResult:Car = Object.assign({ id: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5' }, car)
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => carMockResult)
      const result = await carService.save(carPayload)
      expect(result).toBe(carMockResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(carPayload)
    })

    it(`should return a car (update) ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => car)
      const result = await carService.save(car)
      expect(result).toBe(car)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(car)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(carService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const carId = '2597f381-5ffe-4d28-9f85-8b181ffa1dd5'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await carService.delete(carId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(carId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(carService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
