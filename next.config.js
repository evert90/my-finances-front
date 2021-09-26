module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'https://desktop-27v6i4N:21200/api' // development api
            : 'https://desktop-27v6i4N:21200/api' // production api
    }

}