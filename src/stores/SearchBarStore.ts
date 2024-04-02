import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'
import { Stock } from '@/interfaces/Stock'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'

export const useSearchBarStore = defineStore('searchBar', () => {
    let debounceTimeout: NodeJS.Timeout | null = null

    const state = {
        status: ref(StoreStatus.isIdle),
        matchedQuery: ref<List<Stock>>([]),
    }

    const actions = {
        async onInput(value: string) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            debounceTimeout = setTimeout(async () => {
                if (!value) return false
                state.status.value = StoreStatus.isBusy
                try {
                    const response = await HttpService.get(
                        `/stock/search?query=${value}`
                    )
                    if (response.data.status === HttpStatus.ERROR) {
                        throw response.data.message
                    }
                    state.matchedQuery.value = Stock.fromJson(response.data)

                    state.status.value = StoreStatus.isIdle
                } catch (error) {
                    state.status.value = StoreStatus.isError
                    console.error('[SearchBarStore] ', error)
                }
            }, 500)
        },
        filter(item: Stock, query: string) {
            return (
                item.stockName.toLowerCase().includes(query.toLowerCase()) ||
                item.stockCode.includes(query.toLowerCase())
            )
        },
    }

    return {
        ...state,
        ...actions,
    }
})
