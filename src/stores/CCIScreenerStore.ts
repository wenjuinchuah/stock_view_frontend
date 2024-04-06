import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { CCI } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'

export const useCCIScreenerStore = defineStore('cciScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: CCI = addRuleStore.availableRules['CCI'] as CCI

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed(() => stockScreenerStore.stockScreener)

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.CCI) {
            state.defaultValue.value = stockScreener.value.stockIndicator
                .CCI as CCI
        }
    })

    const state = {
        isValidate: ref<boolean>(true),
        defaultValue: ref<CCI>(
            availableRules ??
                ({
                    overbought: 100,
                    oversold: -100,
                    timePeriod: 20,
                } as CCI)
        ),
    }

    const actions = {
        screenerSelection(): ScreenerSelection[] {
            const cci = stockScreenerStore.getScreenerSelection('CCI')
            return Object.entries(cci).map(([key, value]) => {
                return {
                    title: value,
                    value: key,
                } as ScreenerSelection
            })
        },
        updateStockScreener(
            timePeriod: number,
            selectionType: string,
            value: number
        ) {
            const overbought: number | null =
                selectionType === 'overbought' ? value : null
            const oversold: number | null =
                selectionType === 'oversold' ? value : null

            stockScreenerStore.updateIndicator('CCI', {
                timePeriod,
                overbought,
                oversold,
            })
        },
    }

    return {
        ...state,
        ...actions,
    }
})
