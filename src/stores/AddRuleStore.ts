import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'
import { StockIndicator } from '@/interfaces/StockIndicator'

export const useAddRuleStore = defineStore('addRule', () => {
    const state = {
        status: ref<StoreStatus>(StoreStatus.isIdle),
        isToggled: ref<boolean>(false),
        availableRules: ref<Record<string, StockIndicator>>({}),
        selectedRules: ref<string[]>([]),
    }

    const actions = {
        fetch() {
            try {
                state.status.value = StoreStatus.isBusy
                // fetch something
                state.availableRules.value = {
                    CCI: {
                        timePeriod: 20,
                        overbought: 100,
                        oversold: -100,
                    },
                    MACD: {
                        fastPeriod: 12,
                        slowPeriod: 26,
                        signalPeriod: 9,
                    },
                    KDJ: {
                        loopbackPeriod: 9,
                        signalPeriod: 3,
                        smoothPeriod: 3,
                    },
                }
                state.status.value = StoreStatus.isIdle
            } catch (error) {
                state.status.value = StoreStatus.isError
                throw error
            }
        },
        toggle() {
            state.isToggled.value = !state.isToggled.value
        },
        addRules(rules: List<string>) {
            state.selectedRules.value = []
            rules.forEach((rule) => {
                state.selectedRules.value.push(rule)
            })
        },
        removeRules(rules: List<string>) {
            const newSelectedRules = state.selectedRules.value.filter(
                (rule) => !rules.includes(rule)
            )
            state.selectedRules.value = newSelectedRules
        },
    }

    return {
        ...state,
        ...actions,
    }
})
