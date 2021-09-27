const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:21200/api' // development api
            : 'http://localhost:21200/api' // production api
    }
})