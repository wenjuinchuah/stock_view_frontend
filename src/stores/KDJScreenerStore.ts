import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { KDJ } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { StockScreener } from '@/classes/StockScreener'

export const useKDJScreenerStore = defineStore('kdjScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: KDJ = addRuleStore.availableRules?.get('KDJ') as KDJ

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed<StockScreener>(
        () => stockScreenerStore.stockScreener
    )

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.has('KDJ')) {
            state.defaultValue.value = stockScreener.value.stockIndicator.get(
                'KDJ'
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
                    deadCross: false,
                } as KDJ)
        ),
    }

    const actions = {
        screenerSelection(): ScreenerSelection[] {
            const kdj = stockScreenerStore.getScreenerSelection('KDJ')
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
            const goldenCross = selectionType === 'golden_cross'
            const deadCross = selectionType === 'dead_cross'
            stockScreenerStore.updateIndicator('KDJ', {
                loopbackPeriod,
                signalPeriod,
                smoothPeriod,
                goldenCross,
                deadCross,
            } as KDJ)
        },
    }

    return {
        ...state,
        ...actions,
    }
})
