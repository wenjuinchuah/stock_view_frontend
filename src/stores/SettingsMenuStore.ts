import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStockChartStore } from '@/stores/StockChartStore'
import { StoreStatus } from '@/enums/StoreStatus'

export const useSettingsMenuStore = defineStore('settingsMenu', () => {
    const stockChartStore = useStockChartStore()

    const state = {
        isToggled: ref(false),
        status: ref<StoreStatus>(StoreStatus.isIdle),
    }

    const actions = {
        async selectStock(stockCode: string) {
            state.status.value = StoreStatus.isBusy
            try {
                await stockChartStore.fetch(stockCode)
                // stockChartStore.updateSelectedStock(stock)
                state.status.value = StoreStatus.isIdle
            } catch (error) {
                state.status.value = StoreStatus.isError
                console.error(error)
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
