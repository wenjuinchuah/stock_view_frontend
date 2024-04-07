import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { MACD } from '@/classes/StockIndicator'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'

export const useMACDScreenerStore = defineStore('macdScreener', () => {
    const addRuleStore = useAddRuleStore()
    const availableRules: MACD = addRuleStore.availableRules['MACD'] as MACD

    const stockScreenerStore = useStockScreenerStore()
    const stockScreener = computed(() => stockScreenerStore.stockScreener)

    watch(stockScreener, () => {
        if (stockScreener.value.stockIndicator.MACD) {
            state.defaultValue.value = stockScreener.value.stockIndicator
                .MACD as MACD
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
    }

    const actions = {
        screenerSelection(): ScreenerSelection[] {
            const macd = stockScreenerStore.getScreenerSelection('MACD')
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
            signalPeriod: number,
        ) {
            const bearish = selectionType === 'bearish'
            const bullish = selectionType === 'bullish'
            stockScreenerStore.updateIndicator('MACD', {
                fastPeriod,
                slowPeriod,
                signalPeriod,
                bearish,
                bullish,
            } as MACD)
        },
    }

    return {
        ...state,
        ...actions,
    }
})
