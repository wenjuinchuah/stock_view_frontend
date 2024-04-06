import { StockIndicator } from '@/classes/StockIndicator'
import { StockDetails } from '@/classes/StockDetails'

export class StockScreener {
    startDate: number
    endDate: number
    stockIndicator: Record<string, StockIndicator> = {}
    lastStockCode?: string
    pageSize?: number = 20
    result?: StockDetails[]

    constructor(
        startDate: number,
        endDate: number,
        stockIndicator: Record<string, StockIndicator>,
        lastStockCode: string,
        pageSize: number,
        result: StockDetails[]
    ) {
        this.startDate = startDate
        this.endDate = endDate
        this.stockIndicator = stockIndicator
        this.lastStockCode = lastStockCode
        this.pageSize = pageSize
        this.result = result
    }

    static fromJson(json: any): StockScreener {
        const data = json.data
        return {
            startDate: data.start_date,
            endDate: data.end_date,
            stockIndicator: StockIndicator.fromJson(data.stock_indicator),
            lastStockCode: data.last_stock_code,
            pageSize: data.page_size,
            result: StockDetails.fromJson(data.result),
        }
    }

    static toJson(stockScreener: StockScreener): any {
        return {
            start_date: stockScreener.startDate,
            end_date: stockScreener.endDate,
            stock_indicator: StockIndicator.toJson(
                stockScreener.stockIndicator ?? {}
            ),
            last_stock_code: stockScreener.lastStockCode,
            page_size: stockScreener.pageSize ?? 20,
        }
    }
}
