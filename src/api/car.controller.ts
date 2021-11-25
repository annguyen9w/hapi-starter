import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { ICarsController } from './interfaces/cars.interface';
import { CarService } from '../service/car';
import { CarDTO } from '../dto/car';
import { Car } from '../entity/Car';
import { CarMapper } from '../helpers/mapper/car';
import { RaceResultService } from '../service/race-result';

@injectable()
class CarController extends HapiController implements ICarsController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.CarMapper) private carMapper: CarMapper,
    @inject(TYPES.CarService) private carService: CarService,
    @inject(TYPES.RaceResultService) private raceResultService: RaceResultService) {
    super();
    this.logger.info('Created controller CarController');
  }

  /**
   * Get all car
   */
  @HapiRoute({
    method: 'GET',
    path: 'cars',
    options: {
      validate: {
        query: {
          model: Joi.string().allow(null, ''),
          make: Joi.string().allow(null, '')
        }
      },
      description: 'Get all car',
      tags: ['Car'],
      auth: false
    }
  })
  public async getCars(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.carService.findAllByQuery(request.query));
  }

  /**
   * Update an existing car
   */
  @HapiRoute({
    method: 'PUT',
    path: 'cars/{carId}',
    options: {
      validate: {
        params: {
          carId: Joi.string().length(36).required()
        },
        payload: {
          make: Joi.string().required(),
          model: Joi.string().required(),
          class: Joi.string().length(36).required(),
          team: Joi.string().length(36).required()
        }
      },
      description: 'Update an existing car',
      tags: ['Car'],
      auth: false
    }
  })
  public async updateCar(request: Request, toolkit: ResponseToolkit) {
    const item = await this.carService.findById(request.params.carId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: Car = this.carMapper.map(CarDTO, Car, request.payload);
    payload.id = request.params.carId;
    await this.carService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Add a new car to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'cars',
    options: {
      validate: {
        payload: {
          make: Joi.string().required(),
          model: Joi.string().required(),
          class: Joi.string().length(36).required(),
          team: Joi.string().length(36).required()
        }
      },
      description: 'Add a new car to the system',
      tags: ['Car'],
      auth: false
    }
  })
  public async addCar(request: Request, toolkit: ResponseToolkit) {
    const payload: Car = this.carMapper.map(CarDTO, Car, request.payload);
    const car: Car|undefined = await this.carService.save(payload);
    return toolkit.response({
      id: car?.id,
      status: 'success'
    });
  }

  /**
   * Find car by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'cars/{carId}',
    options: {
      validate: {
        params: {
          carId: Joi.string().length(36).required()
        }
      },
      description: 'Find car by ID',
      tags: ['Car'],
      auth: false
    }
  })
  public async getCarById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.carService.findById(request.params.carId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a car
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'cars/{carId}',
    options: {
      validate: {
        params: {
          carId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a car',
      tags: ['Car'],
      auth: false
    }
  })
  public async deleteCar(request: Request, toolkit: ResponseToolkit) {
    const result = await this.carService.delete(request.params.carId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

  /**
   * All race results for that car
   */
     @HapiRoute({
      method: 'GET',
      path: 'cars/{carId}/results',
      options: {
        validate: {
          params: {
            carId: Joi.string().length(36).required()
          }
        },
        description: 'All race results for that car',
        tags: ['Car'],
        auth: false
      }
    })
    public async getRaceResultsByCarId(request: Request, toolkit: ResponseToolkit) {
      const item = await this.carService.findById(request.params.carId);
      if (!item) {
        throw Boom.notFound();
      }
      return toolkit.response(await this.raceResultService.findByQuery({ car: request.params.carId }));
    }
}

export { CarController }
