<script setup lang="ts">
import { CCI } from '@/interfaces/stockIndicator'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { computed, ref, watch } from 'vue'

const addRuleStore = useAddRuleStore()
const availableRules = computed(() => addRuleStore.availableRules)

const stockScreenerStore = useStockScreenerStore()
const screenerSelection = (indicator) =>
    stockScreenerStore.getScreenerSelection(indicator)

const defaultValue =
    (stockScreenerStore.stockScreener.stockIndicator &&
        stockScreenerStore.stockScreener.stockIndicator['CCI']) ??
    (availableRules.value['CCI']?.value as CCI)

const data = ref<CCI>({
    timePeriod: defaultValue?.timePeriod || 20,
    overbought: defaultValue?.overbought || 100,
    oversold: defaultValue?.oversold || -100,
})

const select = ref(null)
const value = ref<number>(0)

watch(select, (newValue) => {
    if (newValue && newValue.type) {
        value.value =
            newValue.type === 'overbought'
                ? data.value.overbought
                : data.value.oversold
    } else {
        value.value = 0
    }
})

watch(value, (newValue) => {
    if (select.value) {
        if (select.value.type === 'overbought') {
            data.value.overbought = newValue
            data.value.oversold = null
        } else {
            data.value.oversold = newValue
            data.value.overbought = null
        }
    }
})

watch([value, data], () => {
    stockScreenerStore.updateIndicators({
        CCI: data.value,
    })
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
                :item-title="screenerSelection('CCI').title"
                v-model="select"
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
                v-model="data.timePeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
</template>
