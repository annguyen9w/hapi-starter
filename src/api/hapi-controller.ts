import { ServerRoute } from '@hapi/hapi'
import { injectable } from 'inversify'
import 'reflect-metadata'

/**
 * This is a base class that all of our HAPI controllers extend.  It implements:
 * 
 * 1. A base API path which is prepended onto each route
 * 2. A scheme for tracking all HapiControllers using a private static variable. 
 *    This scheme allows us to do things across all HapiContainers, such as generate
 *    a complete set of HAPI router configurations.
 * 3. Provides a base class that we can add common functionality to for all HapiControllers.
 */
@injectable()
class HapiController {

  /*
        This static code is used to track all instances of HapiControllers so 
        we can generate a combined set of routes for the entire application.
    */ 
  private static controllers: Array<HapiController> = []

  /*
        This is the base path for the entire API.  For example, if your @HapiRoute annotation
        defines an endpoint at "myendpoint", it will be registered at "/api/myendpoint"
    */
  private static basePath = '/api/'

  /**
     * Static method that allows for the HAPI server initialization code to derive a complete
     * set of routing data from one place.
     * 
     * @returns an array of server route data for all HapiControllers in the application
     */
  public static getRoutes(): Array<ServerRoute> {
    let routes: Array<ServerRoute> = []
    HapiController.controllers.forEach(
      c => routes = routes.concat(...c.routes.map(r => {
        r.path = this.basePath + r.path
        return r
      }))
    )
    return routes
  }
    
  public routes: Array<ServerRoute> = []

  /**
     * Tracking HapiContainers is implemented in the constructor.  
     * Make sure you are calling super() in your subclasses!
     */
  constructor() {
    //Track the controller
    HapiController.controllers.push(this)

    //We need this due to some issues with "this" and decorators.
    const routes = (this as any).__proto__.routes
    routes.forEach((r: any) => {
      if (r.handler) {
        r.handler = r.handler.bind(this)
        this.routes.push(r)
      }
    })
  }
}

export  { HapiController }