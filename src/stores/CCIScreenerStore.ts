import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { CCI } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import type { StockScreener } from '@/classes/StockScreener'

export const useCCIScreenerStore = defineStore('cciScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: CCI = addRuleStore.availableRules?.get('CCI') as CCI

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed<StockScreener>(
        () => stockScreenerStore.stockScreener
    )

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.has('CCI')) {
            state.defaultValue.value = stockScreener.value.stockIndicator.get(
                'CCI'
            ) as CCI
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
            if (!cci) return []
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
        ): void {
            const overbought: number | null =
                selectionType === 'overbought' ? value : null
            const oversold: number | null =
                selectionType === 'oversold' ? value : null

            stockScreenerStore.updateIndicator('CCI', {
                timePeriod,
                overbought,
                oversold,
            } as CCI)
        },
    }

    return {
        ...state,
        ...actions,
    }
})
