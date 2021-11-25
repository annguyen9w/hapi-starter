import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { IDriversController } from './interfaces/drivers.interface';
import { DriverService } from '../service/driver';
import { DriverDTO } from '../dto/driver';
import { Driver } from '../entity/Driver';
import { DriverMapper } from '../helpers/mapper/driver';
import { RaceResultService } from '../service/race-result';

@injectable()
class DriverController extends HapiController implements IDriversController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.DriverMapper) private driverMapper: DriverMapper,
    @inject(TYPES.DriverService) private driverService: DriverService,
    @inject(TYPES.RaceResultService) private raceResultService: RaceResultService) {
    super();
    this.logger.info('Created controller DriverController');
  }

  /**
   * Get all driver
   */
  @HapiRoute({
    method: 'GET',
    path: 'drivers',
    options: {
      validate: {},
      description: 'Get all driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async getDrivers(request: Request, toolkit: ResponseToolkit) {
    const data = await this.driverService.findAll();
    return toolkit.response(data);
  }

  /**
   * Update an existing driver
   */
  @HapiRoute({
    method: 'PUT',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        },
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          homeAddress: Joi.string().length(36).allow(null),
          managementAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Update an existing driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async updateDriver(request: Request, toolkit: ResponseToolkit) {
    const item = await this.driverService.findById(request.params.driverId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: Driver = this.driverMapper.map(DriverDTO, Driver, request.payload);
    payload.id = request.params.driverId;
    await this.driverService.save(payload);
    return toolkit.response().code(204);
  }

  /**
   * Add a new driver to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'drivers',
    options: {
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          homeAddress: Joi.string().length(36).allow(null),
          managementAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Add a new driver to the system',
      tags: ['Driver'],
      auth: false
    }
  })
  public async addDriver(request: Request, toolkit: ResponseToolkit) {
    const payload: Driver = this.driverMapper.map(DriverDTO, Driver, request.payload);
    const driver: Driver|undefined = await this.driverService.save(payload);
    return toolkit.response(driver?.id).code(201);
  }

  /**
   * Find driver by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        }
      },
      description: 'Find driver by ID',
      tags: ['Driver'],
      auth: false
    }
  })
  public async getDriverById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.driverService.findById(request.params.driverId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a driver
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async deleteDriver(request: Request, toolkit: ResponseToolkit) {
    const result = await this.driverService.delete(request.params.driverId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response().code(204);
  }

  /**
   * All race results for that driver
   */
  @HapiRoute({
    method: 'GET',
    path: 'drivers/{driverId}/results',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        }
      },
      description: 'All race results for that driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async getRaceResultsByDriverId(request: Request, toolkit: ResponseToolkit) {
    const item = await this.driverService.findById(request.params.driverId);
    if (!item) {
      throw Boom.notFound();
    }
    const data = await this.raceResultService.findByQuery({ driver: request.params.driverId });
    return toolkit.response(data);
  }
}

export { DriverController }
