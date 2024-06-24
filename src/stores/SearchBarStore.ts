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
        // Get the stock details based on the input value
        async onInput(value: string): Promise<void> {
            // Clear the debounce timeout
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            // Set the debounce timeout for 500ms to prevent multiple API calls
            debounceTimeout = setTimeout(async () => {
                if (!value || value.includes('[') || value.includes(']'))
                    return false
                state.status.value.setBusy()
                try {
                    const response = await HttpService.get(
                        `/stock/search?query=${value}`
                    )
                    if (response.data.status === HttpStatus.ERROR) {
                        throw response.data
                    }
                    state.matchedQuery.value =
                        (Stock.fromJson(response.data) as Stock[]) ?? []

                    state.status.value.setIdle()
                } catch (error) {
                    state.status.value.setError((error as Error).message)
                }
            }, 500)
        },
        // Filter the stock based on the query
        filter(item: Stock, query: string): boolean {
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
