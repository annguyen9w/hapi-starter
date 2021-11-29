import { ServerRoute } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { HapiController } from './hapi-controller'
import { HelloWorldController } from './helloworld-controller'
import { AddressController } from './address.controller'
import { ClassController } from './class.controller'
import { TeamController } from './team.controller'
import { DriverController } from './driver.controller'
import { CarController } from './car.controller'
import { RaceController } from './race.controller'
import { RaceResultController } from './race-result.controller'

/**
 * The purpose of this class is to simply collect all of our controllers so we can generate
 * routes for them in one place.  
 * 
 * Each controller we create should extend HapiController - this hooks that controller into 
 * a scheme for tracking the controllers and adding operations common to all of the controllers.
 * 
 * For every controller, there should be a private instance of that controller injected into
 * this class.  Behind the scenes, HapiController will evaluate the class for @HapiRoute 
 * annotations and create HAPI route configurations for each annotated method.  
 */
@injectable()
class Controllers {

  @inject(TYPES.HelloWorldController) 
  private helloWorldController?: HelloWorldController

  @inject(TYPES.AddressController) 
  private addressController?: AddressController

  @inject(TYPES.ClassController) 
  private classController?: ClassController

  @inject(TYPES.TeamController) 
  private teamController?: TeamController

  @inject(TYPES.DriverController) 
  private driverController?: DriverController

  @inject(TYPES.CarController) 
  private carController?: CarController

  @inject(TYPES.RaceController) 
  private raceController?: RaceController

  @inject(TYPES.RaceResultController) 
  private RaceResultController?: RaceResultController

  /**
     * Wraps the static getRoutes() method on HapiController.  This makes more sense
     * semantically to ask for routes for all controllers on this class as opposed
     * to a random base class not used anywhere else in the application.
     * 
     * This is invoked in ApiServer during HAPI startup.
     */
  public getRoutes(): Array<ServerRoute> {
    return HapiController.getRoutes()
  }
}

export { Controllers }