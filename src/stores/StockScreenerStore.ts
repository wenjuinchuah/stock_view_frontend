import { defineStore } from 'pinia'
import { StoreStatus } from '@/classes/StoreStatus'
import { StockScreener } from '@/classes/StockScreener'
import { StockDetails } from '@/classes/StockDetails'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'
import { HttpStatus } from '@/enums/HttpStatus'
import type { StockIndicator } from '@/classes/StockIndicator'

export const useStockScreenerStore = defineStore('stockScreener', () => {
    const currentDate: number = new Date().setHours(0, 0, 0, 0)

    const state = {
        status: ref<StoreStatus>(new StoreStatus()),
        isToggled: ref<boolean>(false),
        stockScreener: ref<StockScreener>({
            startDate: currentDate / 1000 - 86400 * 30,
            endDate: currentDate / 1000,
            stockIndicator: new Map<string, StockIndicator>(),
        }),
        screenerResult: ref<StockDetails[]>([]),
        indicatorSelector: ref<Map<string, any>>(),
        isValidate: ref<boolean>(true),
        sortPercentageByPositive: ref<boolean | undefined>(true),
        sortPriceByPositive: ref<boolean | undefined>(),
    }

    const actions = {
        // Fetch the stock screener data
        async fetch(refresh: boolean = false): Promise<void> {
            if (refresh) {
                state.stockScreener.value.lastStockCode = undefined
                state.screenerResult.value = []
            }
            state.status.value.setBusy()
            try {
                // Update the page size based on the number of results
                methods.updatePageSize()

                // Fetch the stock screener data
                const response = await HttpService.post(
                    '/stock_screener/screen',
                    StockScreener.toJson(state.stockScreener.value)
                )
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                }
                state.stockScreener.value = StockScreener.fromJson(
                    response.data
                )

                // Append the results to the screener result
                state.stockScreener.value.result?.forEach((stockDetails) => {
                    state.screenerResult.value.push(stockDetails)
                })

                // Sort the results based on the selected sorting method
                if (state.sortPercentageByPositive.value !== undefined) {
                    actions.sortByPercentageChange(true)
                } else if (state.sortPriceByPositive.value !== undefined) {
                    actions.sortByPrice(true)
                }
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        // Toggle the stock screener
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
        },
        // Update the start date
        startDateChange(date: Date): void {
            state.stockScreener.value.startDate = date.getTime() / 1000
        },
        // Update the end date
        endDateChange(date: Date): void {
            state.stockScreener.value.endDate = date.getTime() / 1000
        },
        // Update the stock indicator
        updateIndicator(indicator: string, value: any): void {
            state.stockScreener.value.stockIndicator.set(indicator, value)
        },
        // Remove the stock indicator
        removeIndicators(indicators: string[]): void {
            indicators.forEach((indicator) => {
                state.stockScreener.value.stockIndicator.delete(indicator)
            })
        },
        // Get the indicator selector
        async getIndicatorSelector(): Promise<void> {
            try {
                state.status.value.setBusy()
                const response = await HttpService.get(
                    '/stock_screener/indicator_selector/get'
                )
                if (response.data.status === HttpStatus.ERROR) {
                    throw response.data
                }
                state.indicatorSelector.value = new Map(
                    Object.entries(response.data.data)
                )
                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        // Get the screener selection
        getScreenerSelection(indicator: string): StockIndicator | undefined {
            return state.indicatorSelector.value?.get(indicator.toLowerCase())
        },
        // Submit the stock screener
        submit(): void {
            actions.toggle()
            if (state.isValidate.value) {
                actions.fetch(true)
            }
        },
        // Sort the stock screener by percentage change
        sortByPercentageChange(remain: boolean = false): void {
            state.sortPriceByPositive.value = undefined
            if (!remain) {
                state.sortPercentageByPositive.value =
                    !state.sortPercentageByPositive.value
            }

            state.screenerResult.value.sort((a, b) =>
                state.sortPercentageByPositive.value
                    ? b.percentageChange - a.percentageChange
                    : a.percentageChange - b.percentageChange
            )
        },
        // Sort the stock screener by price
        sortByPrice(remain: boolean = false): void {
            state.sortPercentageByPositive.value = undefined
            if (!remain) {
                state.sortPriceByPositive.value =
                    !state.sortPriceByPositive.value
            }

            state.screenerResult.value.sort((a, b) =>
                state.sortPriceByPositive.value
                    ? b.closePrice - a.closePrice
                    : a.closePrice - b.closePrice
            )
        },
        // Export the stock screener results
        exportResults(): void {
            const header = ['stock_code', 'stock_name']
            const data = state.screenerResult.value.map((stock) => [
                stock.stockCode,
                stock.stockName,
            ])
            const csv = [header, ...data]
                .map((line) => line.join(','))
                .join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            const date = new Date()
            date.setHours(date.getHours() + 8)

            a.href = url
            a.download = `screener_${date.toISOString().replace(/[-:]/g, '').slice(0, 15)}.csv`
            a.click()
            window.URL.revokeObjectURL(url)
        },
    }

    const methods = {
        // Update the page size based on the number of results
        updatePageSize(): void {
            if (state.screenerResult.value.length < 10) {
                state.stockScreener.value.pageSize = 1
            } else if (state.screenerResult.value.length < 20) {
                state.stockScreener.value.pageSize = 10
            } else {
                state.stockScreener.value.pageSize! = 20
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
