<script setup lang="ts">
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useCCIScreenerStore } from '@/stores/CCIScreenerStore'
import { useMACDScreenerStore } from '@/stores/MACDScreenerStore'
import { useKDJScreenerStore } from '@/stores/KDJScreenerStore'
// TODO: Add new indicator here
import DateRangePicker from '@/components/DateRangePicker.vue'
import AddRule from '@/components/AddRule.vue'
import CCIScreener from '@/components/CCIScreener.vue'
import MACDScreener from '@/components/MACDScreener.vue'
import KDJScreener from '@/components/KDJScreener.vue'
// TODO: Add new indicator here
import { onMounted, computed, watch } from 'vue'
import { Indicator } from '@/enums/Indicator'

const stockScreenerStore = useStockScreenerStore()
const startDate = () =>
    new Date(stockScreenerStore.stockScreener.startDate * 1000)
const endDate = () => new Date(stockScreenerStore.stockScreener.endDate * 1000)

const addRuleStore = useAddRuleStore()
const selectedRules = computed(() =>
    addRuleStore.selectedRules.filter((value) => value !== Indicator.VOLUME)
)

// Initialize the store on mounted
onMounted(async () => {
    await addRuleStore.init()
    await stockScreenerStore.getIndicatorSelector()
})

// Watch the selected rules changes
watch(selectedRules, () => {
    const screenerStores: any[] = []
    selectedRules.value.forEach((value) => {
        if (value === Indicator.CCI) {
            screenerStores.push(useCCIScreenerStore())
        }
        if (value === Indicator.MACD) {
            screenerStores.push(useMACDScreenerStore())
        }
        if (value === Indicator.KDJ) {
            screenerStores.push(useKDJScreenerStore())
        }
        // TODO: Add new indicator here
    })
    if (selectedRules.value.length === 0) {
        stockScreenerStore.isValidate = true
    } else {
        screenerStores.forEach((store) => {
            const isValidate = computed(() => store.isValidate)
            watch(isValidate, () => {
                stockScreenerStore.isValidate = isValidate.value
            })
        })
    }
})
</script>

<template>
    <v-form @submit.prevent validate-on="submit">
        <v-dialog
            max-width="800"
            v-model="stockScreenerStore.isToggled"
            scrollable
        >
            <v-card class="pa-4">
                <v-row no-gutters justify="space-between">
                    <v-col cols="auto">
                        <v-card-title>Technical Stock Screener</v-card-title>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn
                            icon="close"
                            variant="plain"
                            @click.stop="stockScreenerStore.toggle"
                        ></v-btn>
                    </v-col>
                </v-row>
                <!-- Date range picker -->
                <v-row no-gutters>
                    <v-col cols="auto" align-self="center">
                        <v-card-text class="py-0"
                            >Show me all stocks range</v-card-text
                        >
                    </v-col>
                    <v-col cols="auto">
                        <DateRangePicker
                            @update:start-date="
                                stockScreenerStore.startDateChange
                            "
                            @update:end-date="stockScreenerStore.endDateChange"
                            :startDate="startDate()"
                            :endDate="endDate()"
                        />
                    </v-col>
                </v-row>
                <!-- Rules -->
                <template v-if="selectedRules.length === 0">
                    <v-img
                        :src="'/assets/svgs/add_new_rules.svg'"
                        alt="add new rules"
                        class="mt-4"
                        height="300"
                    ></v-img>
                    <v-row no-gutters class="mb-4">
                        <v-col align="center" class="font-weight-medium"
                            >No rules yet</v-col
                        >
                    </v-row>
                </template>
                <template v-else v-for="value in selectedRules" :key="value">
                    <div class="m-4">
                        <v-row no-gutters justify="space-between">
                            <v-col cols="auto"
                                ><v-card-text class="text-blue-darken-3"
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
                                        addRuleStore.removeRules([value])
                                    "
                                    >Delete</v-btn
                                ></v-col
                            >
                        </v-row>
                        <template v-if="value === Indicator.CCI">
                            <CCIScreener />
                        </template>
                        <template v-else-if="value === Indicator.MACD">
                            <MACDScreener />
                        </template>
                        <template v-else-if="value === Indicator.KDJ">
                            <KDJScreener />
                        </template>
                        <!-- TODO: Add new indicator here -->
                    </div>
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
                        >Add new rules
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
                            addRuleStore.removeRules(addRuleStore.selectedRules)
                        "
                        >Delete All Rules</v-btn
                    >
                    <v-btn
                        class="bg-blue-darken-3 ms-4"
                        width="200"
                        @click.stop="stockScreenerStore.submit()"
                        :disabled="
                            !stockScreenerStore.isValidate ||
                            stockScreenerStore.status.isBusy()
                        "
                        type="submit"
                        >Start Screening</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>
