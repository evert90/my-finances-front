module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://192.168.0.24:21200/api' // development api
            : 'http://192.168.0.24:21200/api' // production api
    },
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: `http://192.168.0.24:21200/:path*`,
          }
        ]
      }

}