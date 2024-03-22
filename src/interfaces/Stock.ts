export interface Stock {
  stockCode: string
  stockName: string
  category: string
  isShariah: boolean
}

export namespace Stock {
  export function fromJson(json: any): Stock {
    const data = json.data
    return {
      stockCode: data.stock_code,
      stockName: data.stock_name,
      category: data.category,
      isShariah: data.is_shariah == 1 ? true : false
    }
  }
}
