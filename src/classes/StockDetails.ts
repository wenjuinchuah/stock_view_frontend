export class StockDetails {
    stockCode: string
    stockName: string
    closePrice: number
    percentageChange: number

    constructor(
        stockCode: string,
        stockName: string,
        closePrice: number,
        percentageChange: number
    ) {
        this.stockCode = stockCode
        this.stockName = stockName
        this.closePrice = closePrice
        this.percentageChange = percentageChange
    }

    static fromJson(json: any): StockDetails[] {
        if (Array.isArray(json)) {
            return json.map((item: any) => {
                return {
                    stockCode: item.stock_code,
                    stockName: item.stock_name,
                    closePrice: item.close_price,
                    percentageChange: item.percentage_change,
                }
            })
        }
        return []
    }
}
