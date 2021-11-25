import { Request, ResponseToolkit } from "@hapi/hapi";

/**
 * This file is automatically generated from swagger.  It is safe to overwrite an existing file with this one.
 *
 * This file defines the interface that the ClassesController must conform to.  This helps the Typescript
 * compiler to alert the developer when the swagger specification for methods covered by this controller have changed, and the
 * developer needs to make changes to the implementation in order to support the updated API.
 */
interface IClassesController {



  /**
  * Get all class
  */
  public async getClasses(request: Request, toolkit: ResponseToolkit);

  /**
  * Add a new class to the system
  */
  public async addClass(request: Request, toolkit: ResponseToolkit);

  /**
  * Find class by ID
  */
  public async getClassById(request: Request, toolkit: ResponseToolkit);

  /**
  * Update an existing class
  */
  public async updateClass(request: Request, toolkit: ResponseToolkit);

  /**
  * Delete a class
  */
  public async deleteClass(request: Request, toolkit: ResponseToolkit);

}

export { IClassesController }
