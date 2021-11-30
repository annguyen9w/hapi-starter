import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Race } from '../entity/Race'
import { RaceService } from '../service/race'

const race:Race = {
  id: '13599db2-b244-4e44-8c27-b87301d41b7f',
  name: 'Le Mans'
}

describe('Race Service', () => {
  const tags = (global as any).tags
  let raceService: RaceService
  let repository: Repository<Race>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Race>()
    raceService = new RaceService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a race ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => race)
      const result = await raceService.findById(String(race.id))
      expect(result).toBe(race)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(race.id)
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await raceService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(raceService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of races ${tags.positive}`, async () => {
      const races:Race[] = [race]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => races)
      const result = await raceService.findAll()
      expect(result).toBe(races)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should return empty an array of races ${tags.positive}`, async () => {
      const races:Race[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => races)
      const result = await raceService.findAll()
      expect(result).toBe(races)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(raceService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a race (create) ${tags.positive}`, async () => {
      const racePayload = {
        name: 'Le Mans'
      }
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => race)
      const result = await raceService.save(racePayload)
      expect(result).toBe(race)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(racePayload)
    })

    it(`should return a race (update) ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => race)
      const result = await raceService.save(race)
      expect(result).toBe(race)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(race)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(raceService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const raceId = '13599db2-b244-4e44-8c27-b87301d41b7f'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await raceService.delete(raceId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(raceId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(raceService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
