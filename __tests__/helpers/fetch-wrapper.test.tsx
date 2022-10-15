import mockAxios from 'jest-mock-axios';
import { Tag } from '../../class/Tag';
import { fetchWrapper } from '../../helpers/fetch-wrapper';

describe('Fetch wrapper', () => {
    afterEach(() => {
        mockAxios.reset();
    });

    test('should call an api with get method and return the value', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const data = [new Tag(1, "tag1")];

        //when
        fetchWrapper.get('/tags').then(thenFn).catch(catchFn);
        mockAxios.mockResponse({ data });
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.get).toHaveBeenCalledWith('/tags')
        expect(thenFn).toHaveBeenCalledWith(data);
        expect(catchFn).not.toHaveBeenCalled();
    })

    test('should call an api with get method and return an error', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const data = {message: "Error"};

        //when
        fetchWrapper.get('/tags').then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.get).toHaveBeenCalledWith('/tags')
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(data.message);
    })

    test('should call an api with get method and return an error with message inside response', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const message = "Error";
        const data = {
            response: {
                data: { message }
            }
        };

        //when
        fetchWrapper.get('/tags').then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.get).toHaveBeenCalledWith('/tags')
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(message);
    })

    test('should call an api with post method and return the value', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const requestData = {name: "tag"};
        const responseData = new Tag(1, "tag");

        //when
        fetchWrapper.post('/tags', requestData).then(thenFn).catch(catchFn);
        mockAxios.mockResponse({ data: responseData });
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.post).toHaveBeenCalledWith('/tags', requestData, {"headers": {"Content-Type": "application/json"}, "withCredentials": true})
        expect(thenFn).toHaveBeenCalledWith(responseData);
        expect(catchFn).not.toHaveBeenCalled();
    })

    test('should call an api with post method and return an error', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const requestData = {name: "tag"};
        const data = {message: "Error"};

        //when
        fetchWrapper.post('/tags', requestData).then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.post).toHaveBeenCalledWith('/tags', requestData, {"headers": {"Content-Type": "application/json"}, "withCredentials": true})
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(data.message);
    })

    test('should call an api with post method and return an error with message inside response', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const requestData = {name: "tag"};
        const message = "Error";
        const data = {
            response: {
                data: { message }
            }
        };

        //when
        fetchWrapper.post('/tags', requestData).then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.post).toHaveBeenCalledWith('/tags', requestData, {"headers": {"Content-Type": "application/json"}, "withCredentials": true})
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(message);
    })

    test('should call an api with delete method', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const data = { message: "Scheduled delete" };

        //when
        fetchWrapper.delete('/tags/1').then(thenFn).catch(catchFn);
        mockAxios.mockResponse({ data });
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.delete).toHaveBeenCalledWith('/tags/1')
        expect(thenFn).toHaveBeenCalledWith(data);
        expect(catchFn).not.toHaveBeenCalled();
    })

    test('should call an api with delete method and return an error', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const data = {message: "Error"};

        //when
        fetchWrapper.delete('/tags').then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.delete).toHaveBeenCalledWith('/tags')
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(data.message);
    })

    test('should call an api with delete method and return an error with message inside response', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const message = "Error";
        const data = {
            response: {
                data: { message }
            }
        };

        //when
        fetchWrapper.delete('/tags/1').then(thenFn).catch(catchFn);
        mockAxios.mockError(data);
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.delete).toHaveBeenCalledWith('/tags/1')
        expect(thenFn).not.toHaveBeenCalled();
        expect(catchFn).toHaveBeenCalledWith(message);
    })
})