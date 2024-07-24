import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { CCI } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import type { StockScreener } from '@/classes/StockScreener'
import { Indicator, IndicatorSelection } from '@/enums/Indicator'

export const useCCIScreenerStore = defineStore('cciScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: CCI = addRuleStore.availableRules?.get(
        Indicator.CCI
    ) as CCI

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed<StockScreener>(
        () => stockScreenerStore.stockScreener
    )

    // Watch for changes in the stock screener
    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.has(Indicator.CCI)) {
            state.defaultValue.value = stockScreener.value.stockIndicator.get(
                Indicator.CCI
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
        selectionIndex: ref<number>(0),
    }

    const actions = {
        // Get the available CCI screener selection
        screenerSelection(): ScreenerSelection[] {
            const cci = stockScreenerStore.getScreenerSelection(Indicator.CCI)
            if (!cci) return []
            return Object.entries(cci).map(([key, value]) => {
                return {
                    title: value,
                    value: key,
                } as ScreenerSelection
            })
        },
        // Update the CCI screener selection value
        updateStockScreener(
            timePeriod: number,
            selectionType: string,
            value: number
        ): void {
            const overbought: number | null =
                selectionType === IndicatorSelection.OVERBOUGHT ? value : null
            const oversold: number | null =
                selectionType === IndicatorSelection.OVERSOLD ? value : null

            state.defaultValue.value = {
                timePeriod,
                overbought,
                oversold,
            } as CCI

            stockScreenerStore.updateIndicator(
                Indicator.CCI,
                state.defaultValue.value
            )
        },
    }

    return {
        ...state,
        ...actions,
    }
})
