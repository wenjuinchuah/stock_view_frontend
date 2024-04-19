import { defineStore } from 'pinia'
import { PriceList } from '@/classes/PriceList'
import { Stock } from '@/classes/Stock'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/classes/StoreStatus'
import { ref } from 'vue'
import { type Chart } from 'klinecharts'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useChartSettingsStore } from '@/stores/ChartSettingsStore'

export const useStockChartStore = defineStore('stockChart', () => {
    const defaultStockCode: string = '0001'
    const addRuleStore = useAddRuleStore()
    const chartSettingsStore = useChartSettingsStore()

    const state = {
        priceList: ref<PriceList[]>(),
        status: ref<StoreStatus>(new StoreStatus()),
        selectedStock: ref<Stock>(),
        stockChart: ref<Chart>(),
        indicatorPaneDetails: ref<Map<string, string>>(new Map()),
    }

    const actions = {
        async init(chart: Chart): Promise<void> {
            state.status.value.setBusy()

            state.stockChart.value = chart
            await actions.fetch()

            if (state.stockChart.value) {
                // Stock chart settings
                state.stockChart.value!.setPriceVolumePrecision(3, 0)
            }
        },
        async getStockByStockCode(
            stockCode: string
        ): Promise<Stock | undefined> {
            const response = await HttpService.get(
                `/stock/details/get?stock_code=${stockCode}`
            )
            return Stock.fromJson(response.data) as Stock
        },
        async fetch(
            stockCode: string = state.selectedStock.value
                ? state.selectedStock.value.stockCode
                : defaultStockCode
        ): Promise<void> {
            state.status.value.setBusy()
            try {
                const response = await HttpService.get(
                    `/stock/get?stock_code=${stockCode}&auto_adjust=${chartSettingsStore.adjustData}&time_period=${chartSettingsStore.selectedTimeInterval}`
                )
                const priceList = PriceList.fromJson(response.data)
                if (priceList && state.stockChart.value) {
                    state.stockChart.value.applyNewData(priceList)
                    state.priceList.value = priceList

                    if (state.priceList.value.length === 0) {
                        state.status.value.setError(
                            'This stock is currently not available.'
                        )
                    }
                }

                state.selectedStock.value =
                    await actions.getStockByStockCode(stockCode)

                actions.updateChartIndicators()
                state.stockChart.value?.resize()

                state.status.value.setIdle()
            } catch (error) {
                state.status.value.setError((error as Error).message)
            }
        },
        updateChartIndicators(): void {
            if (state.stockChart.value) {
                let selectedRules: string[] = addRuleStore.selectedRules
                if (chartSettingsStore.showVolume) {
                    selectedRules.push('VOL')
                } else {
                    selectedRules = selectedRules.filter(
                        (rule) => rule !== 'VOL'
                    )
                }

                // Remove indicators that are not selected
                state.indicatorPaneDetails.value.forEach((paneId, rule) => {
                    if (
                        !selectedRules.includes(rule) ||
                        selectedRules.length === 0
                    ) {
                        state.stockChart.value!.removeIndicator(paneId, rule)
                        state.indicatorPaneDetails.value.delete(rule)
                    }
                })

                // Add indicators that are selected
                selectedRules.forEach((rule) => {
                    const paneId: string =
                        state.stockChart.value!.createIndicator(rule) ?? ''

                    if (state.indicatorPaneDetails.value.has(rule)) {
                        const oldPaneId: string =
                            state.indicatorPaneDetails.value.get(rule) ?? ''
                        state.stockChart.value!.removeIndicator(oldPaneId, rule)
                    }

                    state.indicatorPaneDetails.value.set(rule, paneId)
                })
            }
        },
    }

    return {
        ...state,
        ...actions,
    }
})
