import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import { StockIndicator } from '@/classes/StockIndicator'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'

export const useAddRuleStore = defineStore('addRule', () => {
    const stockScreenerStore = useStockScreenerStore()

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        availableRules: ref<Map<string, StockIndicator>>(),
        selectedRules: ref<string[]>([]),
    }

    const actions = {
        async fetch(): Promise<void> {
            try {
                state.status.value.setBusy()
                const response = await HttpService.get(
                    '/stock_screener/available_rules/get'
                )
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                }
                state.availableRules.value = new Map(
                    Object.entries(response.data.data)
                )
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
        },
        updateRules(rules: string[]): void {
            state.selectedRules.value = rules
        },
        removeRules(rules: string[]): void {
            const newSelectedRules = state.selectedRules.value.filter(
                (rule) => !rules.includes(rule)
            )
            state.selectedRules.value = newSelectedRules
            stockScreenerStore.removeIndicators(rules)
        },
    }

    return {
        ...state,
        ...actions,
    }
})
