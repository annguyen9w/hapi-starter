import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Class } from '../entity/Class'
import { ClassService } from '../service/class'

describe('Class Service', () => {
  const tags = (global as any).tags
  let classService: ClassService
  let repository: Repository<Class>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Class>()
    classService = new ClassService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a class ${tags.positive}`, async () => {
      const classItem:Class = { id: '7d30024c-260b-4dd8-b363-5d96ba55609d', name: 'LM GTE PRO' }
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => classItem)
      const result = await classService.findById(String(classItem.id))
      expect(result).toBe(classItem)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(classItem.id)
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await classService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(classService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })

  describe(`findByIds ${tags.read}`, () => {
    it(`should return an array of classes ${tags.positive}`, async () => {
      const classes:Class[] = [
        { id: '12c67109-0130-477a-8528-a7538f9720f3', name: 'LM GTE AM' },
        { id: '7d30024c-260b-4dd8-b363-5d96ba55609d', name: 'LM GTE PRO' }
      ]
      const mockRepository = jest.spyOn(repository, 'findByIds').mockImplementation(async () => classes)
      const result = await classService.findByIds(classes.map(c => ({ id: c.id })))
      expect(result).toBe(classes)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(classes.map(c => ({ id: c.id })))
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findByIds').mockImplementation(() => { throw Error('error') })
      await expect(classService.findByIds([])).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith([])
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of classes ${tags.positive}`, async () => {
      const classes:Class[] = [
        { id: '12c67109-0130-477a-8528-a7538f9720f3', name: 'LM GTE AM' },
        { id: '7d30024c-260b-4dd8-b363-5d96ba55609d', name: 'LM GTE PRO' }
      ]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => classes)
      const result = await classService.findAll()
      expect(result).toBe(classes)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should return empty an array of classes ${tags.positive}`, async () => {
      const classes:Class[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => classes)
      const result = await classService.findAll()
      expect(result).toBe(classes)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(classService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith()
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a class (create) ${tags.positive}`, async () => {
      const classItem:Class = {
        name: 'LM GTE AM'
      }
      const classWithId:Class = {
        id: '7d30024c-260b-4dd8-b363-5d96ba55609d',
        ...classItem
      }
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => classWithId)
      const result = await classService.save(classItem)
      expect(result).toBe(classWithId)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(classItem)
    })

    it(`should return a class (update) ${tags.positive}`, async () => {
      const classItem:Class = {
        id: '7d30024c-260b-4dd8-b363-5d96ba55609d',
        name: 'LM GTE AM'
      }
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => classItem)
      const result = await classService.save(classItem)
      expect(result).toBe(classItem)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(classItem)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(classService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const classId = '7d30024c-260b-4dd8-b363-5d96ba55609d'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await classService.delete(classId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(classId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(classService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
