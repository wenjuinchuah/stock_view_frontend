import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStockChartStore } from '@/stores/StockChartStore'
import { StoreStatus } from '@/classes/StoreStatus'

export const useSettingsMenuStore = defineStore('settingsMenu', () => {
    const stockChartStore = useStockChartStore()

    const state = {
        isToggled: ref<boolean>(false),
        status: ref<StoreStatus>(new StoreStatus()),
    }

    const actions = {
        // Display stock chart data based on the stock code provided
        async selectStock(stockCode: string): Promise<void> {
            state.status.value.setBusy()
            try {
                await stockChartStore.fetch(stockCode)
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        // Toggle the settings menu
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
            setTimeout(() => {
                if (stockChartStore.stockChart) {
                    stockChartStore.stockChart.resize()
                }
            }, 250)
        },
    }

    return {
        ...state,
        ...actions,
    }
})
