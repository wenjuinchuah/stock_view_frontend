export interface PriceList {
    pricelistId: string
    open: number
    close: number
    adjClose: number
    high: number
    low: number
    volume: number
    timestamp: number
    stockCode: string
}

export namespace PriceList {
    export function fromJson(json: any): PriceList[] {
        return json.data.map((item: any) => {
            return {
                pricelistId: item.pricelist_id,
                open: item.open,
                close: item.adj_close,
                adjClose: item.adj_close,
                high: item.high,
                low: item.low,
                volume: item.volume,
                timestamp: item.datetime * 1000,
                stockCode: item.stock_code,
            }
        })
    }
}
