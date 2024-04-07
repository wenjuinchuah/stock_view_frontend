<script setup lang="ts">
import { useKDJScreenerStore } from '@/stores/KDJScreenerStore'
import type { ScreenerSelection } from '@/classes/ScreenerSelection'
import { KDJ } from '@/classes/StockIndicator'
import { ref, computed, watch } from 'vue'

const store = useKDJScreenerStore()
const defaultValue = computed<KDJ>(() => store.defaultValue)

const selection = ref<ScreenerSelection>(store.screenerSelection()[0])

const loopbackPeriod = ref<number>(defaultValue.value.loopbackPeriod)
const signalPeriod = ref<number>(defaultValue.value.signalPeriod)
const smoothPeriod = ref<number>(defaultValue.value.smoothPeriod)

watch(
    [selection, loopbackPeriod, signalPeriod, smoothPeriod],
    () => {
        if (
            selection.value &&
            loopbackPeriod.value &&
            signalPeriod.value &&
            smoothPeriod.value
        ) {
            store.updateStockScreener(
                selection.value.value,
                loopbackPeriod.value,
                signalPeriod.value,
                smoothPeriod.value
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
        <v-col cols="auto" align-self="center" class="ml-4">KDJ</v-col>
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
