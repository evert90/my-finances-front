import "@testing-library/jest-dom";

jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        baseUrl: ''  // Change this line and copy your env
    }
}))