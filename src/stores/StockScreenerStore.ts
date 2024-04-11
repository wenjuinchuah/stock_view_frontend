import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { StockScreener } from '@/classes/StockScreener'
import { StockDetails } from '@/classes/StockDetails'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'
import type { StockIndicator } from '@/classes/StockIndicator'

export const useStockScreenerStore = defineStore('stockScreener', () => {
    const currentDate = new Date().setHours(0, 0, 0, 0)

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        stockScreener: ref<StockScreener>({
            startDate: currentDate / 1000 - 86400 * 30,
            endDate: currentDate / 1000,
            stockIndicator: new Map<string, StockIndicator>(),
        }),
        screenerResult: ref<StockDetails[]>([]),
        indicatorSelector: ref<Map<string, any>>(),
        isValidate: ref<boolean>(true),
    }

    const actions = {
        async fetch(refresh: boolean = false) {
            if (refresh) {
                state.stockScreener.value.lastStockCode = undefined
                state.screenerResult.value = []
            }
            state.status.value.setBusy()
            try {
                const response = await HttpService.post(
                    '/stock_screener/screen',
                    StockScreener.toJson(state.stockScreener.value)
                )
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                }
                state.stockScreener.value = StockScreener.fromJson(
                    response.data
                )
                state.stockScreener.value.result?.forEach((stockDetails) => {
                    state.screenerResult.value.push(stockDetails)
                })
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
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
        updateIndicator(indicator: string, value: any) {
            state.stockScreener.value.stockIndicator.set(indicator, value)
        },
        removeIndicators(indicators: string[]) {
            indicators.forEach((indicator) => {
                state.stockScreener.value.stockIndicator.delete(indicator)
            })
        },
        async getIndicatorSelector() {
            try {
                state.status.value.setBusy()
                const response = await HttpService.get(
                    '/stock_screener/indicator_selector/get'
                )
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                }
                state.indicatorSelector.value = new Map(
                    Object.entries(response.data.data)
                )
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        getScreenerSelection(indicator: string) {
            return state.indicatorSelector.value?.get(indicator.toLowerCase())
        },
        submit() {
            actions.toggle()
            if (state.isValidate.value) {
                actions.fetch(true)
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
