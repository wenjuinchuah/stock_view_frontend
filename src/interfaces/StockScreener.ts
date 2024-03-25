import { StockIndicator } from '@/interfaces/StockIndicator'

export interface StockScreener {
  startDate: number
  endDate: number
  stockIndicator?: List<StockIndicator>
  lastStockCode?: string
  pageSize: number
  result?: List<number>
}

export namespace StockScreener {
  export function fromJson(json: any): StockScreener {
    const data = json.data
    return {
      startDate: data.start_date,
      endDate: data.end_date,
      stockIndicator: StockIndicator.fromJson(data.stock_indicator),
      lastStockCode: data.last_stock_code,
      pageSize: data.page_size,
      result: data.result
    }
  }

  export function toJson(stockScreener: StockScreener): any {
    return {
      start_date: stockScreener.startDate,
      end_date: stockScreener.endDate,
      stock_indicator: StockIndicator.toJson(stockScreener.stockIndicator),
      last_stock_code: stockScreener.lastStockCode,
      page_size: stockScreener.pageSize ?? 20
    }
  }
}
