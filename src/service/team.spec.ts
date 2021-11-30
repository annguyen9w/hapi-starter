import { DeleteResult, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Team, NationalityType } from '../entity/Team'
import { TeamService } from '../service/team'

const team:Team = {
  id: '58a54b0a-dfd5-45fd-8752-8702637a0eb9',
  name: 'TOYOTA GAZOO RACING',
  nationality: 'USA' as NationalityType,
  cars: [{
    id: '2597f381-5ffe-4d28-9f85-8b181ffa1dd5',
    make: 'Ferrari',
    model: '488 GTE-LM',
    class: {
      id: '12c67109-0130-477a-8528-a7538f9720f3',
      name: 'LM GTE AM'
    }
  }],
  drivers: [{
    id: '33b66b5a-2e04-489e-a762-764c5928f30e',
    firstName: 'An',
    lastName: 'Nguyễn',
    nationality: 'Viet Nam' as NationalityType,
    homeAddress: {
      id: '0d775ebe-c1e3-4009-8719-2842297987e2',
      street: '5 Phạm Văn Đồng',
      street2: '',
      city: 'Nha Trang',
      state: 'Khánh Hòa',
      zipcode: '65000',
      country: 'Việt Nam'
    }
  }]
}

describe('Team Service', () => {
  const tags = (global as any).tags
  let teamService: TeamService
  let repository: Repository<Team>

  beforeEach(() => {
    const logger = Winston.createLogger({ transports: [] })
    jest.spyOn(logger, 'info').mockImplementation()
    repository = new Repository<Team>()
    teamService = new TeamService(repository, logger)
  })

  describe(`findById ${tags.read}`, () => {
    it(`should return a team ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => team)
      const result = await teamService.findById(String(team.id))
      expect(result).toBe(team)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: team.id },
        relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress']
      })
    })

    it(`should return undefined ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(async () => undefined)
      const result = await teamService.findById('')
      expect(result).toBe(undefined)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: '' },
        relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress']
      })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'findOne').mockImplementation(() => { throw Error('error') })
      await expect(teamService.findById('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({
        where: { id: '' },
        relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress']
      })
    })
  })

  describe(`findAll ${tags.read}`, () => {
    it(`should return an array of teams ${tags.positive}`, async () => {
      const teams:Team[] = [team]
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => teams)
      const result = await teamService.findAll()
      expect(result).toBe(teams)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress'] })
    })

    it(`should return empty an array of teams ${tags.positive}`, async () => {
      const teams:Team[] = []
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(async () => teams)
      const result = await teamService.findAll()
      expect(result).toBe(teams)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress'] })
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'find').mockImplementation(() => { throw Error('error') })
      await expect(teamService.findAll()).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({ relations: ['businessAddress', 'cars', 'cars.class', 'drivers', 'drivers.homeAddress', 'drivers.managementAddress'] })
    })
  })

  describe(`save ${tags.create} ${tags.update}`, () => {
    it(`should return a team (create) ${tags.positive}`, async () => {
      const teamWithoutId:Team = team
      delete teamWithoutId.id
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => teamWithoutId)
      const result = await teamService.save(team)
      expect(result).toBe(teamWithoutId)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(team)
    })

    it(`should return a team (update) ${tags.positive}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(async () => team)
      const result = await teamService.save(team)
      expect(result).toBe(team)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(team)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'save').mockImplementation(() => { throw Error('error') })
      await expect(teamService.save({})).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith({})
    })
  })

  describe(`delete ${tags.delete}`, () => {
    it(`should success ${tags.positive}`, async () => {
      const teamId = '58a54b0a-dfd5-45fd-8752-8702637a0eb9'
      const deleteResult = new DeleteResult()
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(async () => deleteResult)
      const result = await teamService.delete(teamId)
      expect(result).toBe(deleteResult)
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith(teamId)
    })

    it(`should throw error ${tags.negative}`, async () => {
      const mockRepository = jest.spyOn(repository, 'delete').mockImplementation(() => { throw Error('error') })
      await expect(teamService.delete('')).rejects.toThrow('error')
      expect(mockRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository).toHaveBeenCalledWith('')
    })
  })
})
