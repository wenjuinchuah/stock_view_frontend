<script setup lang="ts">
import { CCI } from '@/classes/StockIndicator'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { computed, ref, watch, watchEffect } from 'vue'

type Selection = {
    title: string
    value: string
}

const addRuleStore = useAddRuleStore()
const availableRules: CCI = addRuleStore.availableRules['CCI'] as CCI

const stockScreenerStore = useStockScreenerStore()
const stockScreener = computed(() => stockScreenerStore.stockScreener)
const isSubmit = computed(() => stockScreenerStore.isScreenerSubmit)
const screenerSelection = (indicator: string): Selection[] => {
    const cci = stockScreenerStore.getScreenerSelection(indicator)
    return Object.entries(cci).map(([key, value]) => {
        return {
            title: value,
            value: key,
        } as Selection
    })
}

const defaultValue: CCI =
    stockScreener.value.stockIndicator &&
    stockScreener.value.stockIndicator['CCI']
        ? availableRules
        : {
              overbought: 100,
              oversold: -100,
              timePeriod: 20,
          }

const selection = ref<Selection>(screenerSelection('CCI')[0])
const value = ref<number>(
    selection.value && selection.value.value === 'overbought'
        ? defaultValue.overbought
        : defaultValue.oversold
)
const periodValue = ref<number>(defaultValue.timePeriod)

watch(selection, (newValue) => {
    if (newValue.value === 'overbought') {
        value.value = defaultValue.overbought
    } else {
        value.value = defaultValue.oversold
    }
})

watchEffect(() => {
    if (isSubmit.value) {
        stockScreenerStore.updateIndicator('CCI', {
            overbought:
                selection.value.value === 'overbought' ? value.value : null,
            oversold: selection.value.value === 'oversold' ? value.value : null,
            timePeriod: periodValue.value,
        })
    }
})
</script>

<template>
    <v-row no-gutters class="text-center mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4">CCI</v-col>
        <v-col cols="auto" class="ml-4">
            <v-select
                variant="outlined"
                density="compact"
                hide-details="auto"
                menu-icon="expand_more"
                :items="screenerSelection('CCI')"
                v-model="selection"
                return-object
            >
            </v-select>
        </v-col>
        <v-col cols="2" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="value"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    <v-row no-gutters class="text-center" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4">Period</v-col>
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="periodValue"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
</template>
