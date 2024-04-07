import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStockChartStore } from '@/stores/StockChartStore'
import { StoreStatus } from '@/classes/StoreStatus'

export const useSettingsMenuStore = defineStore('settingsMenu', () => {
    const stockChartStore = useStockChartStore()

    const state = {
        isToggled: ref(false),
        status: ref<StoreStatus>(new StoreStatus()),
    }

    const actions = {
        async selectStock(stockCode: string) {
            state.status.value.setBusy()
            try {
                await stockChartStore.fetch(stockCode)
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        toggle() {
            state.isToggled.value = !state.isToggled.value
        },
    }

    return {
        ...state,
        ...actions,
    }
})
