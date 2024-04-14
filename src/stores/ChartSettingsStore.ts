import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'

export const useChartSettingsStore = defineStore('chartSettings', () => {
    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        showVolume: ref<boolean>(false),
        adjustData: ref<boolean>(true),
        indicators: ref<string[]>([]),
    }

    const actions = {
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
        },
        updateIndicators(indicators: string[]): void {
            state.indicators.value = indicators
        },
        removeIndicators(indicators: string[]): void {
            const newSelectedIndicators = state.indicators.value.filter(
                (indicator) => !indicators.includes(indicator)
            )
            state.indicators.value = newSelectedIndicators
        },
    }

    return {
        ...state,
        ...actions,
    }
})
