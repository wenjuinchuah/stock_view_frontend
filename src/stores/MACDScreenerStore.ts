import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { MACD } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { StockScreener } from '@/classes/StockScreener'
import { Indicator, IndicatorSelection } from '@/enums/Indicator'

export const useMACDScreenerStore = defineStore('macdScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: MACD = addRuleStore.availableRules?.get(
        Indicator.MACD
    ) as MACD

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed<StockScreener>(
        () => stockScreenerStore.stockScreener
    )

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.has(Indicator.MACD)) {
            state.defaultValue.value = stockScreener.value.stockIndicator.get(
                Indicator.MACD
            ) as MACD
        }
    })

    const state = {
        isValidate: ref<boolean>(true),
        defaultValue: ref<MACD>(
            availableRules ??
                ({
                    fastPeriod: 12,
                    slowPeriod: 26,
                    signalPeriod: 9,
                    bearish: false,
                    bullish: false,
                } as MACD)
        ),
        selectionIndex: ref<number>(0),
    }

    const actions = {
        screenerSelection(): ScreenerSelection[] {
            const macd = stockScreenerStore.getScreenerSelection(Indicator.MACD)
            if (!macd) return []
            return Object.entries(macd).map(([key, value]) => {
                return {
                    title: value,
                    value: key,
                } as ScreenerSelection
            })
        },
        updateStockScreener(
            selectionType: string,
            fastPeriod: number,
            slowPeriod: number,
            signalPeriod: number
        ): void {
            state.defaultValue.value = {
                fastPeriod: fastPeriod,
                slowPeriod: slowPeriod,
                signalPeriod: signalPeriod,
                bearish: selectionType === IndicatorSelection.BEARISH,
                bullish: selectionType === IndicatorSelection.BULLISH,
            } as MACD

            stockScreenerStore.updateIndicator(
                Indicator.MACD,
                state.defaultValue.value
            )
        },
    }

    return {
        ...state,
        ...actions,
    }
})
