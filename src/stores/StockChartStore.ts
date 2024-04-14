import { defineStore } from 'pinia'
import { PriceList } from '@/classes/PriceList'
import { Stock } from '@/classes/Stock'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import { type Chart } from 'klinecharts'
import { useAddRuleStore } from './AddRuleStore'

export const useStockChartStore = defineStore('stockChart', () => {
    const defaultStockCode: string = '0001'
    const addRuleStore = useAddRuleStore()

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
        async init(chart: Chart): Promise<void> {
            state.status.value.setBusy()

            state.stockChart.value = chart
            await actions.fetch()

            if (state.stockChart.value && state.priceList.value) {
                state.stockChart.value.applyNewData(
                    state.priceList.value as PriceList[]
                )
            }
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
        updateSelectedStock(stock: Stock): void {
            state.selectedStock.value = stock
        },
        updateChartIndicators(): void {
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
        calculatePercentageChange(): number {
            const priceList: PriceList[] | undefined = state.priceList.value
            if (!priceList || priceList.length < 2) {
                return 0
            }

            const latestPrice = priceList[priceList.length - 1].close
            const previousPrice = priceList[priceList.length - 2].close

            return ((latestPrice - previousPrice) / previousPrice) * 100
        },
        calculatePriceChange(): number {
            const priceList: PriceList[] | undefined = state.priceList.value
            if (!priceList || priceList.length < 2) {
                return 0
            }

            const latestPrice = priceList[priceList.length - 1].close
            const previousPrice = priceList[priceList.length - 2].close

            return latestPrice - previousPrice
        },
    }

    return {
        ...state,
        ...actions,
    }
})
