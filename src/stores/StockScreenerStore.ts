import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { StockScreener } from '@/interfaces/StockScreener'
import { Stock } from '@/interfaces/Stock'
import { PriceList } from '@/interfaces/PriceList'
import { StockIndicator } from '@/interfaces/StockIndicator'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'

export const useStockScreenerStore = defineStore('stockScreener', () => {
    const currentDate = new Date().setHours(0, 0, 0, 0)

    const state = {
        status: ref<StoreStatus>(StoreStatus.isIdle),
        isToggled: ref<boolean>(false),
        stockScreener: ref<StockScreener>({
            startDate: new Date(currentDate).getTime() / 1000 - 2592000,
            endDate: new Date(currentDate).getTime() / 1000,
        }),
    }

    const actions = {
        async fetch(refresh: boolean = false) {
            if (refresh) {
                state.stockScreener.value.lastStockCode = null
            }
            state.status.value = StoreStatus.isBusy
            try {
                const response = await HttpService.post(
                    '/stock_screener/screen',
                    StockScreener.toJson(state.stockScreener.value)
                )
                state.stockScreener.value = StockScreener.fromJson(
                    response.data
                )
                state.status.value = StoreStatus.isIdle
            } catch (error) {
                state.status.value = StoreStatus.isError
                throw error
            }
        },
        toggle() {
            state.isToggled.value = !state.isToggled.value
        },
        startDateChange(date: Date) {
            state.stockScreener.value.startDate = date.getTime() / 1000
        },
        endDateChange(date: Date) {
            state.stockScreener.value.endDate = date.getTime() / 1000
        },
        // calculatePercentageChange(priceList: List<PriceList>) {
        //     if (priceList.length < 2) {
        //         return 0
        //     }

        //     const latestPrice = priceList[priceList.length - 1].close
        //     const previousPrice = priceList[priceList.length - 2].close

        //     return ((latestPrice - previousPrice) / previousPrice) * 100
        // },
        // calculatePriceChange(priceList: List<PriceList>) {
        //     if (priceList.length < 2) {
        //         return 0
        //     }

        //     const latestPrice = priceList[priceList.length - 1].close
        //     const previousPrice = priceList[priceList.length - 2].close

        //     return latestPrice - previousPrice
        // },
        updateIndicators(rules: Record<string, StockIndicator>) {
            state.stockScreener.value.stockIndicator = rules
        },
        getScreenerSelection(indicator: string) {
            switch (indicator) {
                case 'CCI':
                    return [
                        {
                            title: 'is greater than',
                            type: 'overbought',
                        },
                        {
                            title: 'is less than',
                            type: 'oversold',
                        },
                    ]
                    break
                default:
                    break
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
