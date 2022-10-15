import { colorService } from "../../services/color.service"

describe('Color service', () => {
    test('should return the default pallete', () => {
        //when
        const result: Array<string> = colorService.getDefaultPallete()

        //then
        expect(result).toEqual(["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#2B908F", "#F9A3A4", "#90EE7E", "#69D2E7", "#C5D86D", "#C4BBAF"])
    })

    test('should return the colors for incomes and expenses', () => {
        //when
        const result: Array<string> = colorService.getIncomesExpenses()

        //then
        expect(result).toEqual( ['rgb(21, 128, 61)', 'rgb(220, 38, 38)'])
    })
})