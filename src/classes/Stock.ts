export class Stock {
    stockCode: string
    stockName: string
    stockFullName: string
    category?: string
    isShariah: boolean

    constructor(
        stockCode: string,
        stockName: string,
        stockFullName: string,
        isShariah: boolean,
        category?: string
    ) {
        this.stockCode = stockCode
        this.stockName = stockName
        this.stockFullName = stockFullName
        this.isShariah = isShariah
        this.category = category
    }

    static fromJson(json?: any): Stock | Stock[] | undefined {
        if (!json.data) {
            return undefined
        }
        if (Array.isArray(json.data)) {
            return json.data.map((item: any) => {
                return {
                    stockCode: item.stock_code,
                    stockName: item.stock_name,
                    stockFullName: item.stock_full_name,
                    category: item.category,
                    isShariah: item.is_shariah,
                }
            })
        }
        const data = json.data
        return {
            stockCode: data.stock_code,
            stockName: data.stock_name,
            stockFullName: data.stock_full_name,
            category: data.category,
            isShariah: data.is_shariah,
        }
    }

    static toJson(stock: Stock): any {
        return {
            stock_code: stock.stockCode,
            stock_name: stock.stockName,
            stock_full_name: stock.stockFullName,
            category: stock.category,
            is_shariah: stock.isShariah,
        }
    }
}
