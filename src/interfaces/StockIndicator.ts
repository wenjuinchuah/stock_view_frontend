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
    export function fromJson(json: any): StockIndicator {
        if (json.CCI) {
            return {
                timePeriod: json.CCI.time_period,
                overbought: json.CCI.overbought,
                oversold: json.CCI.oversold,
            }
        } else if (json.MACD) {
            return {
                fastPeriod: json.MACD.fast_period,
                slowPeriod: json.MACD.slow_period,
                signalPeriod: json.MACD.signal_period,
            }
        } else if (json.KDJ) {
            return {
                loopbackPeriod: json.KDJ.loopback_period,
                signalPeriod: json.KDJ.signal_period,
                smoothPeriod: json.KDJ.smooth_period,
            }
        }
    }

    export function toJson(
        stockIndicators?: Record<string, StockIndicator>
    ): any {
        if (!stockIndicators) {
            return {}
        } else if (stockIndicators.CCI) {
            return {
                CCI: {
                    time_period: stockIndicators.CCI.timePeriod,
                    overbought: stockIndicators.CCI.overbought,
                    oversold: stockIndicators.CCI.oversold,
                },
            }
        } else if (stockIndicators.MACD) {
            return {
                MACD: {
                    fast_period: stockIndicators.MACD.fastPeriod,
                    slow_period: stockIndicators.MACD.slowPeriod,
                    signal_period: stockIndicators.MACD.signalPeriod,
                },
            }
        } else if (stockIndicators.KDJ) {
            return {
                KDJ: {
                    loopback_period: stockIndicators.KDJ.loopbackPeriod,
                    signal_period: stockIndicators.KDJ.signalPeriod,
                    smooth_period: stockIndicators.KDJ.smoothPeriod,
                },
            }
        }
    }
}
