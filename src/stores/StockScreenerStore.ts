import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { StockScreener } from '@/classes/StockScreener'
import { StockIndicator } from '@/classes/StockIndicator'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'
import { useAddRuleStore } from '@/stores/AddRuleStore'

export const useStockScreenerStore = defineStore('stockScreener', () => {
    const currentDate = new Date().setHours(0, 0, 0, 0)
    const addRuleStore = useAddRuleStore()

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        stockScreener: ref<StockScreener>({
            startDate: currentDate / 1000,
            endDate: currentDate / 1000,
            stockIndicator: {},
        }),
        indicatorSelector: ref<Record<string, any>>({}),
        isScreenerSubmit: ref<boolean>(false),
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
            state.isScreenerSubmit.value = true
            if (
                Object.keys(state.stockScreener.value.stockIndicator).length ===
                addRuleStore.selectedRules.length
            ) {
                actions.fetch()
                console.log(
                    'success',
                    Object.keys(state.stockScreener.value.stockIndicator)
                        .length,
                    addRuleStore.selectedRules.length
                )
            } else {
                console.log(
                    'failed',
                    Object.keys(state.stockScreener.value.stockIndicator)
                        .length,
                    addRuleStore.selectedRules.length
                )
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
