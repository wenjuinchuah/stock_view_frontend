<script setup lang="ts">
import { useChartSettingsStore } from '@/stores/ChartSettingsStore'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import CCIScreener from '@/components/CCIScreener.vue'
import MACDScreener from '@/components/MACDScreener.vue'
import KDJScreener from '@/components/KDJScreener.vue'
// TODO: Add new indicator here
import AddRule from '@/components/AddRule.vue'
import { computed, watch } from 'vue'
import { Indicator } from '@/enums/Indicator'

const chartSettingsStore = useChartSettingsStore()
const addRuleStore = useAddRuleStore()
const stockChartStore = useStockChartStore()
const stockIndicator = computed<string[]>(() =>
    chartSettingsStore.indicators.filter(
        (indicator) => indicator !== Indicator.VOLUME
    )
)

// Update the rules and fetch the stock chart
const submit = () => {
    addRuleStore.updateRules(chartSettingsStore.indicators)
    stockChartStore.fetch()
    chartSettingsStore.toggle()
}

// Watch the selected rules changes
watch(stockIndicator, () => {
    addRuleStore.selectedRules = stockIndicator.value
})
</script>

<template>
    <v-dialog v-model="chartSettingsStore.isToggled" max-width="800" scrollable>
        <v-card class="pa-4">
            <v-row no-gutters justify="space-between">
                <v-col cols="auto">
                    <v-card-title>Chart Settings</v-card-title>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        icon="close"
                        variant="plain"
                        @click.stop="chartSettingsStore.toggle"
                    ></v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters class="mx-2" align="center">
                <v-col cols="auto" class="mr-2">
                    <v-checkbox
                        label="Show volume"
                        hide-details="auto"
                        class="text-black"
                        v-model="chartSettingsStore.showVolume"
                    ></v-checkbox>
                </v-col>
                <v-col cols="auto" class="mr-2">
                    <v-checkbox
                        label="Adjust data for dividends"
                        hide-details="auto"
                        class="text-black"
                        v-model="chartSettingsStore.adjustData"
                    ></v-checkbox>
                </v-col>
                <v-col
                    cols="auto"
                    class="mx-2 text-grey-darken-2"
                    align-self="center"
                    >Time interval</v-col
                >
                <v-col cols="auto" class="mr-2">
                    <v-select
                        density="compact"
                        variant="outlined"
                        hide-details="auto"
                        :items="chartSettingsStore.timeInterval"
                        v-model="chartSettingsStore.selectedTimeInterval"
                    ></v-select>
                </v-col>
            </v-row>

            <!-- Technical Indicators -->
            <v-row no-gutters>
                <v-col cols="auto">
                    <v-card-title>Technical Indicators</v-card-title>
                </v-col>
            </v-row>
            <template v-if="stockIndicator.length === 0">
                <v-img
                    :src="'/assets/svgs/add_new_rules.svg'"
                    alt="add new rules"
                    class="mt-4"
                    height="300"
                ></v-img>
                <v-row no-gutters class="mb-4">
                    <v-col align="center" class="font-weight-medium"
                        >No indicator yet</v-col
                    >
                </v-row>
            </template>

            <template v-else v-for="key in stockIndicator" :key="key">
                <template v-if="key !== Indicator.VOLUME">
                    <div class="m-4">
                        <v-row no-gutters justify="space-between">
                            <v-col cols="auto"
                                ><v-card-text class="text-blue-darken-2"
                                    >AND</v-card-text
                                ></v-col
                            >
                            <v-col cols="auto" align-self="center"
                                ><v-btn
                                    class="text-decoration-underline"
                                    variant="text"
                                    density="compact"
                                    color="red"
                                    @click.stop="
                                        () => {
                                            chartSettingsStore.removeIndicators(
                                                [key]
                                            )
                                        }
                                    "
                                    >Delete</v-btn
                                ></v-col
                            >
                        </v-row>

                        <template v-if="key === Indicator.CCI">
                            <CCIScreener :isSettings="true" />
                        </template>
                        <template v-else-if="key === Indicator.MACD">
                            <MACDScreener :isSettings="true" />
                        </template>
                        <template v-else-if="key === Indicator.KDJ">
                            <KDJScreener :isSettings="true" />
                        </template>
                        <!-- TODO: Add new indicator here -->
                    </div>
                </template>
            </template>
            <!-- Add new rules button -->
            <v-row no-gutters class="mx-3 my-4">
                <v-btn
                    block
                    prepend-icon="add"
                    variant="outlined"
                    @click.stop="addRuleStore.toggle"
                    style="border-style: dashed"
                    height="65"
                    >Add new indicator
                </v-btn>
            </v-row>
            <AddRule />
            <!-- Actions button -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="bg-red mx-4"
                    width="200"
                    @click.stop="
                        chartSettingsStore.removeIndicators(
                            addRuleStore.selectedRules
                        )
                    "
                    >Reset</v-btn
                >
                <v-btn
                    class="bg-blue-darken-3 ms-4"
                    width="200"
                    @click.stop="submit"
                    type="submit"
                    >Save</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
