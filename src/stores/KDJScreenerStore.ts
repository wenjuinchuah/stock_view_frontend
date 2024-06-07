import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { KDJ } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { StockScreener } from '@/classes/StockScreener'
import { Indicator, IndicatorSelection } from '@/enums/Indicator'

export const useKDJScreenerStore = defineStore('kdjScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: KDJ = addRuleStore.availableRules?.get(
        Indicator.KDJ
    ) as KDJ

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed<StockScreener>(
        () => stockScreenerStore.stockScreener
    )

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.has(Indicator.KDJ)) {
            state.defaultValue.value = stockScreener.value.stockIndicator.get(
                Indicator.KDJ
            ) as KDJ
        }
    })

    const state = {
        isValidate: ref<boolean>(true),
        defaultValue: ref<KDJ>(
            availableRules ??
                ({
                    loopbackPeriod: 9,
                    signalPeriod: 3,
                    smoothPeriod: 3,
                    goldenCross: false,
                    deathCross: false,
                } as KDJ)
        ),
        selectionIndex: ref<number>(0),
    }

    const actions = {
        screenerSelection(): ScreenerSelection[] {
            const kdj = stockScreenerStore.getScreenerSelection(Indicator.KDJ)
            if (!kdj) return []
            return Object.entries(kdj).map(([key, value]) => {
                return {
                    title: value,
                    value: key,
                } as ScreenerSelection
            })
        },
        updateStockScreener(
            selectionType: string,
            loopbackPeriod: number,
            signalPeriod: number,
            smoothPeriod: number
        ): void {
            state.defaultValue.value = {
                loopbackPeriod,
                signalPeriod,
                smoothPeriod,
                goldenCross: selectionType === IndicatorSelection.GOLDEN_CROSS,
                deathCross: selectionType === IndicatorSelection.DEATH_CROSS,
            } as KDJ

            stockScreenerStore.updateIndicator(
                Indicator.KDJ,
                state.defaultValue.value
            )
        },
    }

    return {
        ...state,
        ...actions,
    }
})
