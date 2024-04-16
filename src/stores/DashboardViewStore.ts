import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'

export const useDashboardViewStore = defineStore('dashboardView', () => {
    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
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
                    const response2 = await HttpService.get(
                        '/price_list/is_after_trading_hour/get'
                    )
                    if (response2.data.status === HttpStatus.ERROR) {
                        throw response2.data
                    }
                    state.isAfterTradingHour.value = response2.data.data
                }

                if (state.isAfterTradingHour.value === true) {
                    const response3 =
                        await HttpService.post('/price_list/update')
                    if (response3.data.status === HttpStatus.ERROR) {
                        throw response3.data
                    }
                    state.responseMessage.value = response3.data.data.message
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
