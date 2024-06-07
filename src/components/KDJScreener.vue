<script setup lang="ts">
import { useKDJScreenerStore } from '@/stores/KDJScreenerStore'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { KDJ } from '@/classes/StockIndicator'
import { ref, computed, watch } from 'vue'
import { IndicatorSelection } from '@/enums/Indicator'

const props = defineProps({ isSettings: Boolean })

const store = useKDJScreenerStore()
const defaultValue = computed<KDJ>(() => store.defaultValue)

const selection = ref<ScreenerSelection>(
    store.screenerSelection()[store.selectionIndex]
)

const loopbackPeriod = ref<number>(defaultValue.value.loopbackPeriod)
const signalPeriod = ref<number>(defaultValue.value.signalPeriod)
const smoothPeriod = ref<number>(defaultValue.value.smoothPeriod)

watch(selection, (newSelection) => {
    switch (newSelection.value) {
        case IndicatorSelection.GOLDEN_CROSS:
            store.selectionIndex = 0
            break
        case IndicatorSelection.DEATH_CROSS:
            store.selectionIndex = 1
            break
    }
})

watch(
    [selection, loopbackPeriod, signalPeriod, smoothPeriod],
    () => {
        if (
            selection.value &&
            loopbackPeriod.value &&
            signalPeriod.value &&
            smoothPeriod.value
        ) {
            // Convert periods value to number due to v-model return string
            store.updateStockScreener(
                selection.value.value,
                Number(loopbackPeriod.value),
                Number(signalPeriod.value),
                Number(smoothPeriod.value)
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
                KDJ<v-icon
                    icon="info"
                    size="x-small"
                    class="ml-1 mb-1"
                    color="grey-darken-2"
                ></v-icon
                ><v-tooltip location="top" activator="parent">
                    The KDJ indicator is a technical analysis tool that combines
                    elements of the stochastic oscillator and moving averages to
                    identify potential buy and sell signals.
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
        <v-col cols="auto" align-self="center" class="ml-4"
            >Loopback Period</v-col
        >
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="loopbackPeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    <!-- Slow Period -->
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
    <!-- Signal Period -->
    <v-row no-gutters class="text-center mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4"
            >Smooth Period</v-col
        >
        <v-col cols="1" class="ml-4">
            <v-text-field
                variant="outlined"
                density="compact"
                hide-details="auto"
                single-line
                v-model="smoothPeriod"
            >
            </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>
</template>
