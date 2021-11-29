import { createConnection } from 'typeorm'



/**
 * This class is responsible for intiializing a connection to the database through TypeORM.
 */
// TODO: Externalize connection properties
async function initializeDatabase(config: any) {
  //Add entities here
  const entities: Array<any> = ['src/entity/*{.ts,.js}']
    
  await createConnection({
    type: config.get('database.type', 'postgres'),
    host: config.get('database.host', 'localhost'),
    port: config.get('database.port', 5432),
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.database', 'sevenmiles'),
    entities: entities,
    synchronize: config.get('database.synchronize', true),
    logging: config.get('database.logging', false)
  })
}

export { initializeDatabase }