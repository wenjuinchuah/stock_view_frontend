export class StockDetails {
    stockCode: string
    stockName: string
    open: number
    close: number

    constructor(
        stockCode: string,
        stockName: string,
        open: number,
        close: number
    ) {
        this.stockCode = stockCode
        this.stockName = stockName
        this.open = open
        this.close = close
    }

    static fromJson(json: any): StockDetails[] {
        if (Array.isArray(json)) {
            return json.map((item: any) => {
                return {
                    stockCode: item.stock_code,
                    stockName: item.stock_name,
                    open: item.open,
                    close: item.close,
                }
            })
        }
        return []
    }
}
