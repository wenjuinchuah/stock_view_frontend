import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'
import { useStockChartStore } from '@/stores/StockChartStore'

export const useDashboardViewStore = defineStore('dashboardView', () => {
    const stockChartStore = useStockChartStore()

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isDataAvailable: ref<boolean>(false),
        isAfterTradingHour: ref<boolean>(false),
        responseMessage: ref<string>(''),
    }

    const actions = {
        // Initialize the store
        async init(): Promise<void> {
            try {
                state.status.value.setBusy()

                // Check if data is available and if it is after trading hour
                const response1 = await HttpService.get(
                    '/price_list/is_data_available'
                )

                if (response1.data.status === HttpStatus.ERROR) {
                    throw response1.data
                }

                state.isDataAvailable.value = response1.data.data

                if (state.isDataAvailable.value) {
                    const response2 = await HttpService.get(
                        '/price_list/is_after_trading_hour'
                    )

                    if (response2.data.status === HttpStatus.ERROR) {
                        throw response2.data
                    }

                    state.isAfterTradingHour.value = response2.data.data
                }

                // Update the stock data if data is not available or if it is after trading hour
                if (
                    !state.isDataAvailable.value ||
                    state.isAfterTradingHour.value
                ) {
                    const response3 = await HttpService.post('/stock/update')

                    if (response3.data.status === HttpStatus.ERROR) {
                        throw response3.data
                    }

                    state.responseMessage.value = response3.data.data.message
                }

                // Update the price list data if data is not available
                if (!state.isDataAvailable.value) {
                    const response4 = await HttpService.get(
                        '/price_list/update/initialize'
                    )
                    if (response4.data.status === HttpStatus.ERROR) {
                        throw response4.data
                    }
                    state.isDataAvailable.value = true
                }

                // Update the price list data if data is available and it is after trading hour
                if (
                    state.isDataAvailable.value &&
                    state.isAfterTradingHour.value
                ) {
                    const response5 =
                        await HttpService.post('/price_list/update')
                    if (response5.data.status === HttpStatus.ERROR) {
                        throw response5.data
                    }
                    stockChartStore.fetch()
                    state.responseMessage.value = response5.data.data.message
                }

                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
