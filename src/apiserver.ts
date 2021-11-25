import { Server, ServerRegisterPluginObject } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { Controllers } from "./api/controllers";
import { Logger } from "winston";
import { plugins } from "./helpers/plugins";
import { TYPES } from "./ioc/types";

/**
 * This class encapsulates the HAPI server instance, and is responsible for startup and configuration
 */
@injectable()
class ApiServer {
    private hapiServer: Server;

    constructor(
        @inject(TYPES.Configue) private configue: any,
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.Controllers) controllers: Controllers
    ) {
        // Configure HAPI server
        this.hapiServer = new Server({
            port: configue.get('hapi.port', 8080),
            routes: {
              cors: true,
              validate: {
                failAction: async (request, h, err) => {
                    if (process.env.NODE_ENV === 'production') {
                        // In prod, log a limited error message and throw the default Bad Request error.
                        // console.error('ValidationError:', err?.message) // Better to use an actual logger here.
                        this.logger.info('ValidationError:', err)
                        throw Boom.badRequest(`Invalid request payload input`)
                    } else {
                        if (process.env.NODE_ENV !== 'test') {
                            // During development, log and respond with the full error.
                            console.error(err)
                        }
                        throw Boom.badRequest(err?.message)
                    }
                }
              }
            }
        });
        this.hapiServer.validator(require('@hapi/joi'));

        /**
         * Here we are using our injected controllers class to generate all of the 
         * HAPI route configuration data.  You do not need to do anything other than
         * add metadata to your route handlers in your controller and add your controller
         * to the controllers class in order to add a route
         */        
        this.hapiServer.route(controllers.getRoutes());

        /**
         * Register HAPI Plugins.  If you want to add a plugin, add its metadata 
         * to the plugins class.  You do not need to manually register plugins.
         */
        Promise.all(plugins.map((p: any) => this.hapiServer.register(p)))
            .then(() => {
                this.hapiServer.start();
                this.logger.info('Server started.');
            });
    }
}

export { ApiServer }
