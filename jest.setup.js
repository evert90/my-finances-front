jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
      apiUrl: 'http://localhost:21200/api'  // Change this line and copy your env
    }
  }))