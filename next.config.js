module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'https://DESKTOP-27V6I4N:8443/api' // development api
            : 'https://DESKTOP-27V6I4N:8443/api' // production api
    },
}