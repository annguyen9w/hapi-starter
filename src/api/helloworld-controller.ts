import { Lifecycle, Request, ResponseToolkit } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { Logger } from 'winston'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'

/**
 * This is a test controller.  a GET to /api/helloworld
 */
@injectable()
class HelloWorldController extends HapiController {

  /**
     * We use dependency injection through Inversify to provide an instance of the logger
     */
  constructor(@inject(TYPES.Logger) private logger: Logger) { 
    super()
    this.logger.info('Created controller HelloWorldController')
  }

  /**
     * This annotation tells the framework that this method is a route handler for a HAPI route.
     * TODO: Link to instructions on how to add controllers/methods
     */
  @HapiRoute({
    method: 'GET',
    path: 'helloworld', // <== Note that the "/api" part of the path is appended automatically.
    options: {
      description: 'Hello World!',
      tags: ['api', 'test'],
      auth: false
    }
  })
  public getAll(request: Request, toolkit: ResponseToolkit) {
    this.logger.info('getAll invoked')
    return 'Hello World!'
  }

  /**
     * This route tests Joi and Boom integration.  The ID parameter is validated through Joi 
     * to be sure it's an integer.  If you perform a GET on "/api/helloworld/stringID", you'll 
     * get a 400 indicating that the ID passed in the route is not an integer.  If you perform 
     * a GET on "/api/helloworld/123", you'll get a 501 - Not Implemented.
     */
  @HapiRoute({
    method: 'GET',
    path: 'helloworld/{id}',
    options: {
      validate: {
        params: {
          id: Joi.number().integer().required()
        }
      },
      description: 'Not implemented',
      tags: ['api', 'test'],
      auth: false
    }
  })
  public getById(request: Request, toolkit: ResponseToolkit) {
    this.logger.info('getById invoked')
    throw Boom.notImplemented()
  }
}

export { HelloWorldController }