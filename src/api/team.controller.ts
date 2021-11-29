import { Request, ResponseToolkit } from '@hapi/hapi'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { TYPES } from '../ioc/types'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'

import { ITeamsController } from './interfaces/teams.interface'
import { TeamService } from '../service/team'
import { TeamDTO } from '../dto/team'
import { Team } from '../entity/Team'
import { Mapper } from '../helpers/mapper'
import { DriverService } from '../service/driver'

@injectable()
class TeamController extends HapiController implements ITeamsController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Mapper) private mapper: Mapper,
    @inject(TYPES.TeamService) private teamService: TeamService,
    @inject(TYPES.DriverService) private driverService: DriverService) {
    super()
    this.logger.info('Created controller TeamController')
  }

  /**
   * Get all team
   */
  @HapiRoute({
    method: 'GET',
    path: 'teams',
    options: {
      validate: {},
      description: 'Get all team',
      tags: ['Team'],
      auth: false
    }
  })
  public async getTeams(request: Request, toolkit: ResponseToolkit) {
    const data = await this.teamService.findAll()
    return toolkit.response(data)
  }

  /**
   * Update an existing team
   */
  @HapiRoute({
    method: 'PUT',
    path: 'teams/{teamId}',
    options: {
      validate: {
        params: {
          teamId: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          businessAddress: Joi.string().length(36).allow(null),
          drivers: Joi.array().items(Joi.string().length(36))
        }
      },
      description: 'Update an existing team',
      tags: ['Team'],
      auth: false
    }
  })
  public async updateTeam(request: Request, toolkit: ResponseToolkit) {
    try {
      const item = await this.teamService.findById(request.params.teamId)
      if (!item) {
        throw Boom.notFound()
      }
      const payload: Team = this.mapper.map(TeamDTO, Team, request.payload)
      payload.id = request.params.teamId
      if (payload.drivers && payload.drivers.length) {
        const drivers = await this.driverService.findByIds(payload.drivers)
        payload.drivers = drivers
      }
      await this.teamService.save(payload)
      return toolkit.response().code(204)
    } catch (error) {
      throw Boom.badRequest(error as any)
    }
  }

  /**
   * Add a new team to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'teams',
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          businessAddress: Joi.string().length(36).allow(null),
          drivers: Joi.array().items(Joi.string().length(36))
        }
      },
      description: 'Add a new team to the system',
      tags: ['Team'],
      auth: false
    }
  })
  public async addTeam(request: Request, toolkit: ResponseToolkit) {
    try {
      const payload: Team = this.mapper.map(TeamDTO, Team, request.payload)
      if (payload.drivers && payload.drivers.length) {
        const drivers = await this.driverService.findByIds(payload.drivers)
        payload.drivers = drivers
      }
      const team :Team | undefined = await this.teamService.save(payload)
      return toolkit.response(team?.id).code(201)
    } catch (error) {
      throw Boom.badRequest(error as any)
    }
  }

  /**
   * Find team by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'teams/{teamId}',
    options: {
      validate: {
        params: {
          teamId: Joi.string().length(36).required()
        }
      },
      description: 'Find team by ID',
      tags: ['Team'],
      auth: false
    }
  })
  public async getTeamById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.teamService.findById(request.params.teamId)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }

  /**
   * Delete a team
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'teams/{teamId}',
    options: {
      validate: {
        params: {
          teamId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a team',
      tags: ['Team'],
      auth: false
    }
  })
  public async deleteTeam(request: Request, toolkit: ResponseToolkit) {
    try {
      const result = await this.teamService.delete(request.params.teamId)
      if (!result.affected) {
        throw Boom.notFound()
      }
      return toolkit.response().code(204)
    } catch (error) {
      throw Boom.badRequest(error as any)
    }
  }

}

export { TeamController }
