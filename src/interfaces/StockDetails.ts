export interface StockDetails {
    stockCode: string
    stockName: string
    open: number
    close: number
}

export namespace StockDetails {
    export function fromJson(json: any): StockDetails {
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
        const data = json
        return {
            stockCode: data.stock_code,
            stockName: data.stock_name,
            open: data.open,
            close: data.close,
        }
    }
}
