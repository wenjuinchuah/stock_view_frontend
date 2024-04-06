import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { StockScreener } from '@/classes/StockScreener'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'

export const useStockScreenerStore = defineStore('stockScreener', () => {
    const currentDate = new Date().setHours(0, 0, 0, 0)

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        stockScreener: ref<StockScreener>({
            startDate: currentDate / 1000 - 86400 * 30,
            endDate: currentDate / 1000,
            stockIndicator: {},
        }),
        indicatorSelector: ref<Record<string, any>>({}),
        isValidate: ref<boolean>(true),
    }

    const actions = {
        async fetch(refresh: boolean = false) {
            if (refresh) {
                state.stockScreener.value.lastStockCode = undefined
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
            state.stockScreener.value.stockIndicator[indicator] = value
        },
        removeIndicators(indicators: string[]) {
            indicators.forEach((indicator) => {
                delete state.stockScreener.value.stockIndicator[indicator]
            })
        },
        async getIndicatorSelector() {
            try {
                state.status.value.setBusy()
                const response = await HttpService.get(
                    '/stock_screener/indicator_selector/get'
                )
                state.indicatorSelector.value = response.data.data
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        getScreenerSelection(indicator: string) {
            return state.indicatorSelector.value[indicator.toLowerCase()]
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
