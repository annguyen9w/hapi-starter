import 'automapper-ts'
import { injectable } from 'inversify'
import { AddressDTO } from '../dto/address'
import { Address } from '../entity/Address'
import { CarDTO } from '../dto/car'
import { Car } from '../entity/Car'
import { ClassDTO } from '../dto/class'
import { Class } from '../entity/Class'
import { DriverDTO } from '../dto/driver'
import { Driver } from '../entity/Driver'
import { RaceResultDTO } from '../dto/race-result'
import { RaceResult } from '../entity/RaceResult'
import { RaceDTO } from '../dto/race'
import { Race } from '../entity/Race'
import { TeamDTO } from '../dto/team'
import { Team } from '../entity/Team'

/**
 * Wrapper around automapper, for dependency injection convenience (static/global variables bad)
 */
@injectable()
class Mapper {

  /**
     * Helper method, shorthand for "map all properties of the source to the same properties in
     * the destination".  This is useful when your model and entity share the same structuer.
     */
  private createDefaultMap(
    fromType: any, 
    toType: any, 
    fields: Array<string>
  ): AutoMapperJs.ICreateMapFluentFunctions {
    const map = automapper.createMap(fromType, toType)
    fields.forEach(key => {
      map.forMember(key, (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom(key))
    })

    return map
  }

  /** 
     * Helper method, creates mappings between two types in both directions 
     */
  private createDefaultBiDiMap(
    typeA: any, 
    typeB: any,
    fields: Array<string>
  ): Array<AutoMapperJs.ICreateMapFluentFunctions> {
    return [
      this.createDefaultMap(typeA, typeB, fields),
      this.createDefaultMap(typeB, typeA, fields)
    ]
  }

  constructor() {
    // Add code here to configure mappings
    this.createDefaultBiDiMap(
      AddressDTO,
      Address,
      ['id', 'street', 'street2', 'city', 'state', 'zipcode', 'country']
    )
    this.createDefaultBiDiMap(
      CarDTO,
      Car,
      ['id', 'make', 'model', 'class', 'team']
    )
    this.createDefaultBiDiMap(
      ClassDTO,
      Class,
      ['id', 'name']
    )
    this.createDefaultBiDiMap(
      DriverDTO,
      Driver,
      ['id', 'firstName', 'lastName', 'nationality', 'homeAddress', 'managementAddress']
    )
    this.createDefaultBiDiMap(
      RaceResultDTO,
      RaceResult,
      ['id', 'car', 'race', 'driver', 'class', 'raceNumber', 'startPosition', 'finishPosition']
    )
    this.createDefaultBiDiMap(
      RaceDTO,
      Race,
      ['id', 'name', 'raceResults']
    )
    this.createDefaultBiDiMap(
      TeamDTO,
      Team,
      ['id', 'name', 'nationality', 'businessAddress', 'drivers']
    )
  }

  public map(source: any, destination: any, value: any): any {
    return automapper.map(source, destination, value)
  }
}

export { Mapper }