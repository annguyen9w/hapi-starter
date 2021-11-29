
/**
 * Add metadata here for any plugins you want to register with HAPI.  Anything 
 * configured here will be automatically registered with HAPI at start-up.
 */
const plugins = [
  {
    options: {
      path: '/status',
      title: 'API Monitor',
      routeConfig: {
        auth: false
      }
    },
    plugin: require('hapijs-status-monitor')
  },
  {
    options: undefined,
    plugin: require('@hapi/vision')
  },
  {
    options: undefined,
    plugin: require('@hapi/inert')
  }
/*
Commenting this out until there's a fix for an incompatibility between latest joi and the swagger plugin    
    {
        options: {
            info: {
              title: 'API Documentation',
              version: 'v1.0.0',
              contact: {
                name: 'John doe',
                email: 'johndoe@johndoe.com',
              },
            },
            grouping: 'tags',
            sortEndpoints: 'ordered',
        },
        plugin: require('hapi-swagger')
    }
*/
]

export { plugins }