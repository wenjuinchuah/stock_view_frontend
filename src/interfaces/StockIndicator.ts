export interface StockIndicator {}

export interface CCI extends StockIndicator {
  timePeriod: number
  overbought: number
  oversold: number
}

export interface MACD extends StockIndicator {
  fastPeriod: number
  slowPeriod: number
  signalPeriod: number
}

export interface KDJ extends StockIndicator {
  loopbackPeriod: number
  signalPeriod: number
  smoothPeriod: number
}

export namespace StockIndicator {
  export function fromJson(data: any): StockIndicator[] {
    const cci = data.cci
      ? {
          timePeriod: data.cci.time_period,
          overbought: data.cci.overbought,
          oversold: data.cci.oversold
        }
      : null

    const macd = data.macd
      ? {
          fastPeriod: data.macd.fast_period,
          slowPeriod: data.macd.slow_period,
          signalPeriod: data.macd.signal_period
        }
      : null

    const kdj = data.kdj
      ? {
          loopbackPeriod: data.kdj.loopback_period,
          signalPeriod: data.kdj.signal_period,
          smoothPeriod: data.kdj.smooth_period
        }
      : null

    const indicators: List<StockIndicator> = []

    // Add non-null indicators to the array
    if (cci) indicators.push(cci)
    if (macd) indicators.push(macd)
    if (kdj) indicators.push(kdj)

    return indicators
  }
  export function toJson(stockIndicator?: StockIndicator[]): any {
    if (!stockIndicator) {
      return {}
    }

    const json: any = {}

    // Check if each indicator exists in the array and add it to the JSON object if it does
    if (stockIndicator.some((indicator) => indicator instanceof CCI)) {
      json.cci = stockIndicator.find((indicator) => indicator instanceof CCI)
    }

    if (stockIndicator.some((indicator) => indicator instanceof MACD)) {
      json.macd = stockIndicator.find((indicator) => indicator instanceof MACD)
    }

    if (stockIndicator.some((indicator) => indicator instanceof KDJ)) {
      json.kdj = stockIndicator.find((indicator) => indicator instanceof KDJ)
    }

    return json
  }
}
