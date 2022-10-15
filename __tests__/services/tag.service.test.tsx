import mockAxios from 'jest-mock-axios';
import { Tag } from '../../class/Tag';
import { tagService } from '../../services/tag.service';

describe('Tag service', () => {
    afterEach(() => {
        mockAxios.reset();
    });

    test('should call the tags api and return the value', async () => {
        //given
        let catchFn = jest.fn(), thenFn = jest.fn();
        const data = [new Tag(1, "tag1")];

        //when
        tagService.getAll().then(thenFn).catch(catchFn);
        mockAxios.mockResponse({ data });
        await new Promise(process.nextTick);

        //then
        expect(mockAxios.get).toHaveBeenCalledWith('/tags/')
        expect(thenFn).toHaveBeenCalledWith(data);
        expect(catchFn).not.toHaveBeenCalled();
    })
})

