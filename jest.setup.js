import "@testing-library/jest-dom";

jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        baseUrl: 'http://localhost:21200'  // Change this line and copy your env
    }
}))