import { defineStore } from 'pinia'
import { PriceList } from '@/classes/PriceList'
import { Stock } from '@/classes/Stock'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'

export const useStockChartStore = defineStore('stockChart', () => {
    const defaultStockCode: string = '0001'

    const state = {
        priceList: ref<PriceList[]>(),
        status: ref<StoreStatus>(new StoreStatus()),
        selectedStock: ref<Stock>(),
        priceChange: ref<number>(0),
        percentageChange: ref<number>(0),
    }

    const actions = {
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

                state.selectedStock.value =
                    await actions.getStockByStockCode(stockCode)

                state.priceChange.value = methods.calculatePriceChange()
                state.percentageChange.value =
                    methods.calculatePercentageChange()

                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        isPriceListEmpty() {
            return state.priceList.value == null && state.status.value.isIdle()
        },
        updateSelectedStock(stock: Stock) {
            state.selectedStock.value = stock
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
    }

    return {
        ...state,
        ...actions,
    }
})
