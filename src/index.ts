import { container } from './ioc/ioc'
import { TYPES } from './ioc/types'
import { ApiServer } from './apiserver'
import { initializeDatabase } from './helpers/database'
const Configue = require('configue');

(async () => {
  await initializeDatabase(await container.get<typeof Configue>(TYPES.Configue))
  await container.get<ApiServer>(TYPES.ApiServer)
})()
