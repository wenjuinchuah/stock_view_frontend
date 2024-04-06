import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import { Stock } from '@/classes/Stock'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'

export const useSearchBarStore = defineStore('searchBar', () => {
    let debounceTimeout: number | null = null

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        matchedQuery: ref<Stock[]>([]),
    }

    const actions = {
        async onInput(value: string) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            debounceTimeout = setTimeout(async () => {
                if (!value) return false
                state.status.value.setBusy()
                try {
                    const response = await HttpService.get(
                        `/stock/search?query=${value}`
                    )
                    if (response.data.status === HttpStatus.ERROR) {
                        throw response.data.message
                    }
                    state.matchedQuery.value =
                        (Stock.fromJson(response.data) as Stock[]) ?? []

                    state.status.value.setIdle()
                } catch (error) {
                    state.status.value.setError((error as Error).message)
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
