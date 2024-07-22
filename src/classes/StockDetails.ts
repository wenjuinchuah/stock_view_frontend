export class StockDetails {
    stockCode: string
    stockName: string
    closePrice: number
    percentageChange: number
    matchedIndicator: MatchedIndicator[]

    constructor(
        stockCode: string,
        stockName: string,
        closePrice: number,
        percentageChange: number,
        matchedIndicator: MatchedIndicator[]
    ) {
        this.stockCode = stockCode
        this.stockName = stockName
        this.closePrice = closePrice
        this.percentageChange = percentageChange
        this.matchedIndicator = matchedIndicator
    }

    static fromJson(json: any): StockDetails[] {
        if (Array.isArray(json)) {
            return json.map((item: any) => {
                return {
                    stockCode: item.stock_code,
                    stockName: item.stock_name,
                    closePrice: item.close_price,
                    percentageChange: item.percentage_change,
                    matchedIndicator: MatchedIndicator.fromJson(
                        item.matched_indicator
                    ),
                }
            })
        }
        return []
    }
}

export class MatchedIndicator {
    indicator: string
    matchedAt: number

    constructor(indicator: string, matchedAt: number) {
        this.indicator = indicator.toUpperCase()
        this.matchedAt = matchedAt
    }

    static fromJson(json: any): MatchedIndicator[] {
        if (Array.isArray(json)) {
            return json.map((item: any) => {
                return {
                    indicator: item.indicator.toUpperCase(),
                    matchedAt: item.matched_at * 1000,
                }
            })
        }
        return []
    }

    static toJson(matchedIndicators: MatchedIndicator[]): any {
        return matchedIndicators.map((item) => {
            return {
                indicator: item.indicator.toLowerCase(),
                matched_at: item.matchedAt / 1000,
            }
        })
    }
}
