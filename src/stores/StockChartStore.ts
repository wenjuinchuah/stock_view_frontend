import { defineStore } from 'pinia'
import { PriceList } from '@/classes/PriceList'
import { Stock } from '@/classes/Stock'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import { registerIndicator, type Chart, type Overlay } from 'klinecharts'
import { useAddRuleStore } from './AddRuleStore'
import { useStockScreenerStore } from './StockScreenerStore'

export const useStockChartStore = defineStore('stockChart', () => {
    const defaultStockCode: string = '0001'
    const addRuleStore = useAddRuleStore()
    const stockScreenerStore = useStockScreenerStore()

    const state = {
        priceList: ref<PriceList[]>(),
        status: ref<StoreStatus>(new StoreStatus()),
        selectedStock: ref<Stock>(),
        priceChange: ref<number>(0),
        percentageChange: ref<number>(0),
        stockChart: ref<Chart>(),
        indicatorPaneDetails: ref<Map<string, string>>(new Map()),
    }

    const actions = {
        async init(chart: Chart) {
            state.status.value.setBusy()

            state.stockChart.value = chart
            await actions.fetch()

            if (state.stockChart.value && state.priceList.value) {
                state.stockChart.value.applyNewData(
                    state.priceList.value as PriceList[]
                )
            }
            // Register the timeframe indicator
            // methods.addTimeframeIndicator()
        },
        async getStockByStockCode(
            stockCode: string
        ): Promise<Stock | undefined> {
            const response = await HttpService.get(
                `/stock/details/get?stock_code=${stockCode}`
            )
            return Stock.fromJson(response.data) as Stock
        },
        async fetch(
            stockCode: string = state.selectedStock.value
                ? state.selectedStock.value.stockCode
                : defaultStockCode
        ): Promise<void> {
            state.status.value.setBusy()
            try {
                const response = await HttpService.get(
                    `/stock/get?stock_code=${stockCode}`
                )
                state.priceList.value = PriceList.fromJson(response.data)
                state.priceList.value.sort((a, b) => a.timestamp - b.timestamp)

                if (state.priceList.value && state.stockChart.value) {
                    state.stockChart.value.applyNewData(
                        state.priceList.value as PriceList[]
                    )
                }

                state.selectedStock.value =
                    await actions.getStockByStockCode(stockCode)

                // Methods
                state.priceChange.value = methods.calculatePriceChange()
                state.percentageChange.value =
                    methods.calculatePercentageChange()
                actions.updateChartIndicators()
                state.stockChart.value?.resize()

                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        updateSelectedStock(stock: Stock) {
            state.selectedStock.value = stock
        },
        updateChartIndicators() {
            if (state.stockChart.value) {
                const selectedRules: string[] = addRuleStore.selectedRules

                // Remove indicators that are not selected
                state.indicatorPaneDetails.value.forEach((paneId, rule) => {
                    if (
                        !selectedRules.includes(rule) ||
                        selectedRules.length === 0
                    ) {
                        state.stockChart.value!.removeIndicator(paneId, rule)
                        state.indicatorPaneDetails.value.delete(rule)
                    }
                })

                // Add indicators that are selected
                selectedRules.forEach((rule) => {
                    const paneId: string =
                        state.stockChart.value!.createIndicator(rule) ?? ''
                    // state.stockChart.value!.createIndicator('timeframe', true, {
                    //     id: paneId,
                    // })
                    if (rule === 'KDJ') {
                        state.stockChart.value!.createIndicator(
                            'marking',
                            true,
                            { id: paneId }
                        )
                    }

                    if (state.indicatorPaneDetails.value.has(rule)) {
                        const oldPaneId: string =
                            state.indicatorPaneDetails.value.get(rule) ?? ''
                        state.stockChart.value!.removeIndicator(oldPaneId, rule)
                    }

                    state.indicatorPaneDetails.value.set(rule, paneId)
                })
            }
        },
    }

    const methods = {
        calculatePercentageChange() {
            const priceList: PriceList[] | undefined = state.priceList.value
            if (!priceList || priceList.length < 2) {
                return 0
            }

            const latestPrice = priceList[priceList.length - 1].close
            const previousPrice = priceList[priceList.length - 2].close

            return ((latestPrice - previousPrice) / previousPrice) * 100
        },
        calculatePriceChange() {
            const priceList: PriceList[] | undefined = state.priceList.value
            if (!priceList || priceList.length < 2) {
                return 0
            }

            const latestPrice = priceList[priceList.length - 1].close
            const previousPrice = priceList[priceList.length - 2].close

            return latestPrice - previousPrice
        },
        addTimeframeIndicator() {
            registerIndicator({
                name: 'marking',
                shortName: '',
                calc: (kLineDataList) => kLineDataList,
                draw: ({
                    ctx,
                    kLineDataList,
                    indicator,
                    visibleRange,
                    bounding,
                    barSpace,
                    defaultStyles,
                    xAxis,
                    yAxis,
                }) => {
                    const { from, to } = visibleRange
                    const result = indicator.result

                    let previous_k = null
                    let previous_d = null

                    for (let i = from; i < to; i++) {
                        const data = result[i]
                        const x = xAxis.convertToPixel(i)
                        const y = yAxis.convertToPixel(data.close)

                        // Check if the current data point is within the screening timeframe
                        const within_date_range =
                            new Date(data.timestamp).getTime() >=
                                new Date(
                                    stockScreenerStore.stockScreener.startDate
                                ).getTime() &&
                            new Date(data.timestamp).getTime() <=
                                new Date(
                                    stockScreenerStore.stockScreener.endDate
                                ).getTime()

                        if (
                            within_date_range &&
                            previous_k !== null &&
                            previous_d !== null
                        ) {
                            const golden_cross_condition =
                                data.d < data.k &&
                                data.d < data.j &&
                                previous_k < previous_d &&
                                previous_d < data.d
                            const dead_cross_condition =
                                data.d > data.k &&
                                data.d > data.j &&
                                previous_k > previous_d &&
                                previous_d > data.d

                            // Mark the data point if it matches the golden cross or dead cross condition
                            if (
                                golden_cross_condition ||
                                dead_cross_condition
                            ) {
                                ctx.beginPath()
                                ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
                                ctx.fillStyle = golden_cross_condition
                                    ? 'gold'
                                    : 'black'
                                ctx.fill()
                            }
                        }

                        previous_k = data.k
                        previous_d = data.d
                    }
                    return false
                },
            })
        },
    }

    return {
        ...state,
        ...actions,
    }
})
