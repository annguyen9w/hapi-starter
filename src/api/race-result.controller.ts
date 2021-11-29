import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { IRaceResultsController } from './interfaces/race-results.interface';
import { RaceResultService } from '../service/race-result';
import { RaceResultDTO } from '../dto/race-result';
import { RaceResult } from '../entity/RaceResult';
import { RaceResultMapper } from '../helpers/mapper/race-result';

@injectable()
class RaceResultController extends HapiController implements IRaceResultsController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceResultMapper) private RaceResultMapper: RaceResultMapper,
    @inject(TYPES.RaceResultService) private RaceResultService: RaceResultService)
  {
      super();
      this.logger.info('Created controller RaceResultController');
  }

/**
 * Update an existing race_car
 */
  @HapiRoute({
    method: 'PUT',
    path: 'race-results/{raceResultId}',
    options: {
      validate: {
        params: {
          raceResultId: Joi.string().length(36).required()
        },
        payload: {
          car: Joi.string().length(36).required(),
          driver: Joi.string().length(36).required(),
          class: Joi.string().length(36).required(),
          raceNumber: Joi.string().required(),
          startPosition: Joi.number().required(),
          finishPosition: Joi.number().allow(null),
        }
      },
      description: 'Update an existing race result',
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async updateRaceResult(request: Request, toolkit: ResponseToolkit) {
    try {
      const item = await this.RaceResultService.findById(request.params.raceResultId);
      if (!item) {
        throw Boom.notFound();
      }
      const payload: RaceResult = this.RaceResultMapper.map(RaceResultDTO, RaceResult, request.payload);
      payload.id = request.params.raceResultId;
      await this.RaceResultService.save(payload);
      return toolkit.response().code(204);
    } catch (error) {
      throw Boom.badRequest(error as any);
    }
  }

/**
 * Delete a race_car
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'race-results/{raceResultId}',
    options: {
      validate: {
        params: {
          raceResultId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a race result',
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async deleteRaceResult(request: Request, toolkit: ResponseToolkit) {
    try {
      const result = await this.RaceResultService.delete(request.params.raceResultId);
      if (!result.affected) {
        throw Boom.notFound();
      }
      return toolkit.response().code(204);
    } catch (error) {
      throw Boom.badRequest(error as any);
    }
  }

}

export { RaceResultController }
