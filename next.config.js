const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'https://192.168.0.24:21200/api' // development api
            : 'https://192.168.0.24:21200/api' // production api
    }
})