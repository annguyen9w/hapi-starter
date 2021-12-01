import { Request, ResponseToolkit } from '@hapi/hapi'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { TYPES } from '../ioc/types'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'

import { IAddressesController } from './interfaces/addresses.interface'
import { AddressService } from '../service/address'
import { AddressDTO } from '../dto/address'
import { Address } from '../entity/Address'
import { Mapper } from '../helpers/mapper'

@injectable()
class AddressController extends HapiController implements IAddressesController {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Mapper) private mapper: Mapper,
    @inject(TYPES.AddressService) private addressService: AddressService
  ) {
    super()
    this.logger.info('Created controller AddressController')
  }

  /**
   * Get all address
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses',
    options: {
      validate: {},
      description: 'Get all address',
      tags: ['Address'],
      auth: false
    }
  })
  public async getAddresses(request: Request, toolkit: ResponseToolkit) {
    const data = await this.addressService.findAll()
    return toolkit.response(data)
  }

  /**
   * Update an existing address
   */
  @HapiRoute({
    method: 'PUT',
    path: 'addresses/{addressId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        },
        payload: {
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zipcode: Joi.string().required(),
          country: Joi.string().required()
        }
      },
      description: 'Update an existing address',
      tags: ['Address'],
      auth: false
    }
  })
  public async updateAddress(request: Request, toolkit: ResponseToolkit) {
    const item = await this.addressService.findById(request.params.addressId)
    if (!item) {
      throw Boom.notFound()
    }
    const payload: Address = this.mapper.map(AddressDTO, Address, request.payload)
    payload.id = request.params.addressId
    await this.addressService.save(payload)
    return toolkit.response().code(204)
  }

  /**
   * Add a new address to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'addresses',
    options: {
      validate: {
        payload: {
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zipcode: Joi.string().required(),
          country: Joi.string().required()
        }
      },
      description: 'Add a new address to the system',
      tags: ['Address'],
      auth: false
    }
  })
  public async addAddress(request: Request, toolkit: ResponseToolkit) {
    const payload: Address = this.mapper.map(AddressDTO, Address, request.payload)
    await this.addressService.save(payload)
    const address: Address | undefined = await this.addressService.save(payload)
    return toolkit.response(address?.id).code(201)
  }

  /**
   * Find address by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses/{addressId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Find address by ID',
      tags: ['Address'],
      auth: false
    }
  })
  public async getAddressById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.addressService.findById(request.params.addressId)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }

  /**
   * Delete a address
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'addresses/{addressId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a address',
      tags: ['Address'],
      auth: false
    }
  })
  public async deleteAddress(request: Request, toolkit: ResponseToolkit) {
    try {
      const result = await this.addressService.delete(request.params.addressId)
      if (!result.affected) {
        return Boom.notFound()
      }
      return toolkit.response().code(204)
    } catch (error: any) {
      throw Boom.badRequest(error)
    }
  }
}

export { AddressController }
