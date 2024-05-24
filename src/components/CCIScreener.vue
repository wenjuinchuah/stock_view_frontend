<script setup lang="ts">
import { useCCIScreenerStore } from '@/stores/CCIScreenerStore'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { CCI } from '@/classes/StockIndicator'
import { ref, computed, watch } from 'vue'

const props = defineProps({ isSettings: Boolean })

const store = useCCIScreenerStore()
const defaultValue = computed<CCI>(() => store.defaultValue)

const selection = ref<ScreenerSelection>(store.screenerSelection()[0])
const value = ref<number>(
    selection.value.value === 'overbought'
        ? defaultValue.value.overbought
        : defaultValue.value.oversold
)
const periodValue = ref<number>(defaultValue.value.timePeriod)

watch(selection, (newValue) => {
    if (newValue.value === 'overbought') {
        value.value = defaultValue.value.overbought
    } else {
        value.value = defaultValue.value.oversold
    }
})

watch(
    [selection, value, periodValue],
    () => {
        if (selection.value && value.value && periodValue.value) {
            store.updateStockScreener(
                periodValue.value,
                selection.value.value,
                value.value
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
    <v-row no-gutters class="text-center mb-3" justify="space-between">
        <v-col cols="auto" align-self="center" class="ml-4"
            ><span class="text-decoration-underline">
                CCI<v-icon
                    icon="info"
                    size="x-small"
                    class="ml-1 mb-1"
                    color="grey-darken-2"
                ></v-icon
                ><v-tooltip location="top" activator="parent">
                    The Commodity Channel Index (CCI) is a technical analysis
                    tool used to identify overbought or oversold conditions in a
                    market.
                </v-tooltip>
            </span>
        </v-col>
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
        </template>
    </v-row>
    <v-row no-gutters class="text-center mb-3" justify="space-between">
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
