module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:21200/api' // development api
            : 'http://localhost:21200/api' // production api
    }
    
}