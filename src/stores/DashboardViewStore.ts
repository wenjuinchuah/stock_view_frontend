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
        async init(): Promise<void> {
            try {
                state.status.value.setBusy()

                const response = await HttpService.post('/stock/update')
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                } else {
                    state.responseMessage.value = response.data.data.message

                    const [response2, response3] = await Promise.all([
                        HttpService.get('/price_list/is_data_available'),
                        HttpService.get('/price_list/is_after_trading_hour'),
                    ])

                    if (response2.data.status === HttpStatus.ERROR) {
                        throw response2.data
                    }
                    if (response3.data.status === HttpStatus.ERROR) {
                        throw response3.data
                    }

                    state.isDataAvailable.value = response2.data.data
                    state.isAfterTradingHour.value = response3.data.data
                }

                if (!state.isDataAvailable.value) {
                    const response4 = await HttpService.get(
                        '/price_list/update/initialize'
                    )
                    if (response4.data.status === HttpStatus.ERROR) {
                        throw response4.data
                    }
                    state.isDataAvailable.value = true
                }

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
