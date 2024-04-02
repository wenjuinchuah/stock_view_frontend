export interface Stock {
    stockCode?: string
    stockName?: string
    stockFullName?: string
    category?: string
    isShariah: boolean
}

export namespace Stock {
    export function fromJson(json: any): Stock {
        if (Array.isArray(json.data)) {
            return json.data.map((item: any) => {
                return {
                    stockCode: item.stock_code,
                    stockName: item.stock_name,
                    stockFullName: item.stock_full_name,
                    category: item.category,
                    isShariah: item.is_shariah == 1 ? true : false,
                }
            })
        }
        const data = json.data
        return {
            stockCode: data.stock_code,
            stockName: data.stock_name,
            stockFullName: data.stock_full_name,
            category: data.category,
            isShariah: data.is_shariah == 1 ? true : false,
        }
    }
}
