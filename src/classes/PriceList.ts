export class PriceList {
    pricelistId: string
    open: number
    close: number
    adjClose: number
    high: number
    low: number
    volume: number
    timestamp: number
    stockCode: string

    constructor(
        pricelistId: string,
        open: number,
        close: number,
        adjClose: number,
        high: number,
        low: number,
        volume: number,
        timestamp: number,
        stockCode: string
    ) {
        this.pricelistId = pricelistId
        this.open = open
        this.close = close
        this.adjClose = adjClose
        this.high = high
        this.low = low
        this.volume = volume
        this.timestamp = timestamp
        this.stockCode = stockCode
    }

    static fromJson(json: any): PriceList[] {
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

    static toJson(priceList: PriceList): any {
        return {
            pricelist_id: priceList.pricelistId,
            open: priceList.open,
            close: priceList.adjClose,
            adj_close: priceList.adjClose,
            high: priceList.high,
            low: priceList.low,
            volume: priceList.volume,
            datetime: priceList.timestamp / 1000,
            stock_code: priceList.stockCode,
        }
    }
}
