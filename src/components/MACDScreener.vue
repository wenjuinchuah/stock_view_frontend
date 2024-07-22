<script setup lang="ts">
import { useMACDScreenerStore } from '@/stores/MACDScreenerStore'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { MACD } from '@/classes/StockIndicator'
import { ref, computed, watch } from 'vue'
import { IndicatorSelection } from '@/enums/Indicator'

const props = defineProps({ isSettings: Boolean })

const store = useMACDScreenerStore()
const defaultValue = computed<MACD>(() => store.defaultValue)

const selection = ref<ScreenerSelection>(
    store.screenerSelection()[store.selectionIndex]
)

const fastPeriod = ref<number>(defaultValue.value.fastPeriod)
const slowPeriod = ref<number>(defaultValue.value.slowPeriod)
const signalPeriod = ref<number>(defaultValue.value.signalPeriod)

// Watch the selection changes and update the selectionIndex
watch(selection, (newSelection) => {
    switch (newSelection.value) {
        case IndicatorSelection.BULLISH:
            store.selectionIndex = 0
            break
        case IndicatorSelection.BEARISH:
            store.selectionIndex = 1
            break
    }
})

// Watch the value changes and update stock screener
watch(
    [selection, fastPeriod, slowPeriod, signalPeriod],
    () => {
        if (
            selection.value &&
            fastPeriod.value &&
            slowPeriod.value &&
            signalPeriod.value
        ) {
            // Convert periods value to number due to v-model return string
            store.updateStockScreener(
                selection.value.value,
                Number(fastPeriod.value),
                Number(slowPeriod.value),
                Number(signalPeriod.value)
            )
            store.isValidate = true
        } else {
            store.isValidate = false
        }
    },
    { immediate: true }
)
</script>

<template>
    <v-row no-gutters class="text-center mb-3">
        <v-col cols="auto" align-self="center" class="ml-4"
            ><span class="text-decoration-underline">
                MACD<v-icon
                    icon="info"
                    size="x-small"
                    class="ml-1 mb-1"
                    color="grey-darken-2"
                ></v-icon
                ><v-tooltip location="top" activator="parent" max-width="400">
                    The Moving Average Convergence Divergence (MACD) identifies
                    trend direction and strength by showing the relationship
                    between two moving averages. A cross above the signal line
                    suggests a bullish trend; a cross below suggests a bearish
                    trend.
                </v-tooltip>
            </span></v-col
        >
        <template v-if="props.isSettings === false">
            <v-col cols="auto" class="ml-4">
                <v-select
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    menu-icon="expand_more"
                    :items="store.screenerSelection()"
                    v-model="selection"
                    return-object
                >
                </v-select>
            </v-col>
        </template>
    </v-row>
    <!-- Fast Period -->
    <v-row no-gutters class="text-cente mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4">Fast Period</v-col>
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="fastPeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    <!-- Slow Period -->
    <v-row no-gutters class="text-center mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4">Slow Period</v-col>
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="slowPeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    <!-- Signal Period -->
    <v-row no-gutters class="text-center mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4"
            >Signal Period</v-col
        >
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="signalPeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
</template>
