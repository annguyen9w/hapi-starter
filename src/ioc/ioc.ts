import { Container } from 'inversify'
import { Logger } from 'winston'
import { TYPES } from './types'
import { HelloWorldController } from '../api/helloworld-controller'
import { ApiServer } from '../apiserver'
import { Controllers } from '../api/controllers'
import { getConnection, Repository } from 'typeorm'
import * as Winston from 'winston'
import { Mapper } from '../helpers/mapper'
const Configue = require('configue')

import { Address } from '../entity/Address'
import { AddressService } from '../service/address'
import { AddressController } from '../api/address.controller'

import { Class } from '../entity/Class'
import { ClassService } from '../service/class'
import { ClassController } from '../api/class.controller'

import { Team } from '../entity/Team'
import { TeamService } from '../service/team'
import { TeamController } from '../api/team.controller'

import { Driver } from '../entity/Driver'
import { DriverService } from '../service/driver'
import { DriverController } from '../api/driver.controller'

import { Car } from '../entity/Car'
import { CarService } from '../service/car'
import { CarController } from '../api/car.controller'

import { Race } from '../entity/Race'
import { RaceService } from '../service/race'
import { RaceController } from '../api/race.controller'

import { RaceResult } from '../entity/RaceResult'
import { RaceResultService } from '../service/race-result'
import { RaceResultController } from '../api/race-result.controller'

/**
 * This file contains all of the Inversify configuration code.  This is the only
 * place that we should have hard dependencies on any controllers, services, and
 * utilities that we will provide to classes using dependency injection.
 * 
 * Each class managed using inversify will be represented somewhere in this class.
 * 
 * The first step is to create an Inversify container.  The container manages all
 * of the injectable dependencies.  You can tell it how you want each dependency 
 * managed (for example, is it a singleton, or does each reference get its own 
 * instance?) and let the container manage instantiating and injecting dependencies.
 */
const container = new Container()


/**
 * Next, we're going to initialize Configue to help us with externalizing configuration 
 * parameters.  This is the first thing we need, as we can't configure Winston without
 * a log level.
 * 
 * In this case, we use .toConstantValue() because we are already manually creating an
 * instance of Configuue since we need it locally.
 */
const configOpts = {
  defer: false,
  disable: { argv: true },
  files: [
    { 
      file: './dist/config/config.yaml',
      format: require('nconf-yaml')
    }
  ]
}
const configue = new Configue(configOpts)
container.bind<typeof Configue>(TYPES.Configue).toConstantValue(configue)

/**
 * Configure Winston for logging
 */
container.bind<Logger>(TYPES.Logger).toDynamicValue(
  () => {
    const consoleTransport = new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.timestamp(),
        Winston.format.align(),
        Winston.format.printf(info => {
          const { timestamp, level, message, ...args } = info
      
          const ts = timestamp.slice(0, 19).replace('T', ' ')
          return `${ts} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`
        })
      ),
      level: configue.get('logging.level')
    })
      
    return Winston.createLogger({
      transports: [consoleTransport]
    })
  }
).inSingletonScope()

// "Global" classes - things that aren't controllers, repositories, or services.
/**
 * For each dependency we set up a binding in the container to the class that implements 
 * each dependency.  Remember that the purpose of dependency injection/inversion of control 
 * is to avoid hard bindings to things.
 * 
 * To achieve the full benefits of DI, you can use Typescript interfaces to disconnect an
 * object from its implementing class.  This is kind of a lot of work for not a lot of 
 * real-world benefit.  However, they have their place - especially in testing.  You can
 * create different classes that implement the same interface, such as a mock service 
 * that works with dummy data versus a real service that interacts with the database.  If
 * both the mock and the real service implement the same interface, you can provide either
 * the mock or the real service at runtime and dependent code won't know the difference.
 * 
 * Inversify prepares us for this by binding a "source type" (in this case ApiServer) to a
 * symbol - a representation of that type, and bind the symbol to the implemnting class.
 * Below, we bind the symbol TYPES.ApiServer to the class ApiServer.  The "".inSingletonScope()"
 * part of the declaration tells Inversify that we want everyone who needs an ApiServer to
 * get the same instance of ApiServer.
 */
container.bind<Mapper>(TYPES.Mapper).to(Mapper).inSingletonScope()
container.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope()
container.bind<Controllers>(TYPES.Controllers).to(Controllers).inSingletonScope()

/**
 * Utility function to create TypeORM repositories from their types through generics
 */
function createRepository<T>(c: { new (): T }): Repository<T> {
  return getConnection().getRepository(c)
}

// Repositories
container.bind<Repository<Address>>(TYPES.AddressRepository).toDynamicValue(() => createRepository<Address>(Address)).inSingletonScope()
container.bind<Repository<Class>>(TYPES.ClassRepository).toDynamicValue(() => createRepository<Class>(Class)).inSingletonScope()
container.bind<Repository<Team>>(TYPES.TeamRepository).toDynamicValue(() => createRepository<Team>(Team)).inSingletonScope()
container.bind<Repository<Driver>>(TYPES.DriverRepository).toDynamicValue(() => createRepository<Driver>(Driver)).inSingletonScope()
container.bind<Repository<Car>>(TYPES.CarRepository).toDynamicValue(() => createRepository<Car>(Car)).inSingletonScope()
container.bind<Repository<Race>>(TYPES.RaceRepository).toDynamicValue(() => createRepository<Race>(Race)).inSingletonScope()
container.bind<Repository<RaceResult>>(TYPES.RaceResultRepository).toDynamicValue(() => createRepository<RaceResult>(RaceResult)).inSingletonScope()

// Services
container.bind<AddressService>(TYPES.AddressService).to(AddressService).inSingletonScope()
container.bind<ClassService>(TYPES.ClassService).to(ClassService).inSingletonScope()
container.bind<TeamService>(TYPES.TeamService).to(TeamService).inSingletonScope()
container.bind<DriverService>(TYPES.DriverService).to(DriverService).inSingletonScope()
container.bind<CarService>(TYPES.CarService).to(CarService).inSingletonScope()
container.bind<RaceService>(TYPES.RaceService).to(RaceService).inSingletonScope()
container.bind<RaceResultService>(TYPES.RaceResultService).to(RaceResultService).inSingletonScope()

// Controllers
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController).inSingletonScope()
container.bind<AddressController>(TYPES.AddressController).to(AddressController).inSingletonScope()
container.bind<ClassController>(TYPES.ClassController).to(ClassController).inSingletonScope()
container.bind<TeamController>(TYPES.TeamController).to(TeamController).inSingletonScope()
container.bind<DriverController>(TYPES.DriverController).to(DriverController).inSingletonScope()
container.bind<CarController>(TYPES.CarController).to(CarController).inSingletonScope()
container.bind<RaceController>(TYPES.RaceController).to(RaceController).inSingletonScope()
container.bind<RaceResultController>(TYPES.RaceResultController).to(RaceResultController).inSingletonScope()

export { container }