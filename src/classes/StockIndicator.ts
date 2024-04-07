export abstract class StockIndicator {
    static fromJson(json: any): Record<string, StockIndicator> {
        if (json.cci) {
            return {
                CCI: CCI.fromJson(json.cci),
            }
        } else if (json.macd) {
            return {
                MACD: MACD.fromJson(json.macd),
            }
        } else if (json.kdj) {
            return {
                KDJ: KDJ.fromJson(json.kdj),
            }
        }
        return {}
    }

    static toJson(stockIndicators: Record<string, StockIndicator>): any {
        if (stockIndicators.CCI) {
            return {
                cci: CCI.toJson(stockIndicators),
            }
        } else if (stockIndicators.MACD) {
            return {
                macd: MACD.toJson(stockIndicators),
            }
        } else if (stockIndicators.KDJ) {
            return {
                kdj: KDJ.toJson(stockIndicators),
            }
        }
        return {}
    }
}

export class CCI extends StockIndicator {
    timePeriod: number
    overbought: number
    oversold: number

    constructor(timePeriod: number, overbought: number, oversold: number) {
        super()
        this.timePeriod = timePeriod
        this.overbought = overbought
        this.oversold = oversold
    }

    static fromJson(json: any): Record<string, CCI> {
        return {
            timePeriod: json.time_period,
            overbought: json.overbought,
            oversold: json.oversold,
        }
    }

    static toJson(stockIndicator: Record<string, StockIndicator>): any {
        const cci = stockIndicator.CCI as CCI
        return {
            time_period: cci.timePeriod,
            overbought: cci.overbought,
            oversold: cci.oversold,
        }
    }
}

export class MACD extends StockIndicator {
    fastPeriod: number
    slowPeriod: number
    signalPeriod: number
    bearish: boolean
    bullish: boolean

    constructor(
        fastPeriod: number,
        slowPeriod: number,
        signalPeriod: number,
        bearish: boolean,
        bullish: boolean
    ) {
        super()
        this.fastPeriod = fastPeriod
        this.slowPeriod = slowPeriod
        this.signalPeriod = signalPeriod
        this.bearish = bearish
        this.bullish = bullish
    }

    static fromJson(json: any): Record<string, MACD> {
        return {
            fastPeriod: json.fast_period,
            slowPeriod: json.slow_period,
            signalPeriod: json.signal_period,
            bearish: json.bearish,
            bullish: json.bullish,
        }
    }

    static toJson(stockIndicator: Record<string, StockIndicator>): any {
        const macd = stockIndicator.MACD as MACD
        return {
            fast_period: macd.fastPeriod,
            slow_period: macd.slowPeriod,
            signal_period: macd.signalPeriod,
            bearish: macd.bearish,
            bullish: macd.bullish,
        }
    }
}

export class KDJ extends StockIndicator {
    loopbackPeriod: number
    signalPeriod: number
    smoothPeriod: number
    goldenCross: boolean
    deadCross: boolean

    constructor(
        loopbackPeriod: number,
        signalPeriod: number,
        smoothPeriod: number,
        goldenCross: boolean,
        deadCross: boolean

    ) {
        super()
        this.loopbackPeriod = loopbackPeriod
        this.signalPeriod = signalPeriod
        this.smoothPeriod = smoothPeriod
        this.goldenCross = goldenCross
        this.deadCross = deadCross
    }

    static fromJson(json: any): Record<string, KDJ> {
        return {
            loopbackPeriod: json.loopback_period,
            signalPeriod: json.signal_period,
            smoothPeriod: json.smooth_period,
            goldenCross: json.golden_cross,
            deadCross: json.dead_cross,
        }
    }

    static toJson(stockIndicator: Record<string, StockIndicator>): any {
        const kdj = stockIndicator.KDJ as KDJ
        return {
            loopback_period: kdj.loopbackPeriod,
            signal_period: kdj.signalPeriod,
            smooth_period: kdj.smoothPeriod,
            golden_cross: kdj.goldenCross,
            dead_cross: kdj.deadCross,
        }
    }
}
