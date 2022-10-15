import { currencyService } from '../../services/currency.service'

describe('Currency service', () => {
    test('should return value in pt-BR format', () => {
        //given
        const value: number = 2050.75

        //when
        const result: string = currencyService.format(value)

        //then
        //used ALT+255 instead of normal space
        expect(result).toBe("R$ 2.050,75")
    })
})