import { Request, ResponseToolkit } from '@hapi/hapi'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { TYPES } from '../ioc/types'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'

import { IClassesController } from './interfaces/classes.interface'
import { ClassService } from '../service/class'
import { ClassDTO } from '../dto/class'
import { Class } from '../entity/Class'
import { Mapper } from '../helpers/mapper'

@injectable()
class ClassController extends HapiController implements IClassesController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Mapper) private mapper: Mapper,
    @inject(TYPES.ClassService) private classService: ClassService) {
    super()
    this.logger.info('Created controller ClassController')
  }

  /**
   * Get all class
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes',
    options: {
      validate: {},
      description: 'Get all class',
      tags: ['Class'],
      auth: false
    }
  })
  public async getClasses(request: Request, toolkit: ResponseToolkit) {
    const data = await this.classService.findAll()
    return toolkit.response(data)
  }

  /**
   * Update an existing class
   */
  @HapiRoute({
    method: 'PUT',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string().max(100).required()
        }
      },
      description: 'Update an existing class',
      tags: ['Class'],
      auth: false
    }
  })
  public async updateClass(request: Request, toolkit: ResponseToolkit) {
    const item = await this.classService.findById(request.params.classId)
    if (!item) {
      throw Boom.notFound()
    }
    const payload: Class = this.mapper.map(ClassDTO, Class, request.payload)
    payload.id = request.params.classId
    await this.classService.save(payload)
    return toolkit.response().code(204)
  }

  /**
   * Add a new class to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'classes',
    options: {
      validate: {
        payload: {
          name: Joi.string().max(100).required()
        }
      },
      description: 'Add a new class to the system',
      tags: ['Class'],
      auth: false
    }
  })
  public async addClass(request: Request, toolkit: ResponseToolkit) {
    try{
      const payload: Class = this.mapper.map(ClassDTO, Class, request.payload)
      const item: Class | undefined = await this.classService.save(payload)
      return toolkit.response(item?.id).code(201)
    } catch (error: any) {
      throw Boom.badRequest(error)
    }
  }

  /**
   * Find class by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        }
      },
      description: 'Find class by ID',
      tags: ['Class'],
      auth: false
    }
  })
  public async getClassById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.classService.findById(request.params.classId)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }

  /**
   * Delete a class
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a class',
      tags: ['Class'],
      auth: false
    }
  })
  public async deleteClass(request: Request, toolkit: ResponseToolkit) {
    try {
      const result = await this.classService.delete(request.params.classId)
      if (!result.affected) {
        return Boom.notFound()
      }
      return toolkit.response().code(204)
    } catch (error: any) {
      throw Boom.badRequest(error)
    }
  }

}

export { ClassController }
