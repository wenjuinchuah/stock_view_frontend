export abstract class StockIndicator {
    static fromJson(json: any): Map<string, StockIndicator> {
        const indicators = new Map<string, StockIndicator>()
        if (json.cci) {
            indicators.set('CCI', CCI.fromJson(json.cci))
        }
        if (json.macd) {
            indicators.set('MACD', MACD.fromJson(json.macd))
        }
        if (json.kdj) {
            indicators.set('KDJ', KDJ.fromJson(json.kdj))
        }
        return indicators
    }

    static toJson(stockIndicators: Map<string, StockIndicator>): any {
        const json: any = {}
        if (stockIndicators.get('CCI')) {
            json.cci = CCI.toJson(stockIndicators.get('CCI') as CCI)
        }
        if (stockIndicators.get('MACD')) {
            json.macd = MACD.toJson(stockIndicators.get('MACD') as MACD)
        }
        if (stockIndicators.get('KDJ')) {
            json.kdj = KDJ.toJson(stockIndicators.get('KDJ') as KDJ)
        }
        return json
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

    static fromJson(json: any): any {
        return new CCI(json.time_period, json.overbought, json.oversold)
    }

    static toJson(cci: any): any {
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

    static fromJson(json: any): any {
        return new MACD(
            json.fast_period,
            json.slow_period,
            json.signal_period,
            json.bearish,
            json.bullish
        )
    }

    static toJson(macd: any): any {
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

    static fromJson(json: any): any {
        return new KDJ(
            json.loopback_period,
            json.signal_period,
            json.smooth_period,
            json.golden_cross,
            json.dead_cross
        )
    }

    static toJson(kdj: any): any {
        return {
            loopback_period: kdj.loopbackPeriod,
            signal_period: kdj.signalPeriod,
            smooth_period: kdj.smoothPeriod,
            golden_cross: kdj.goldenCross,
            dead_cross: kdj.deadCross,
        }
    }
}
