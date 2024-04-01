<script setup lang="ts">
import { useStockScreenerStore } from "@/stores/StockScreenerStore";
import DateRangePicker from "@/components/DateRangePicker.vue";
// import { computed } from "vue";

const store = useStockScreenerStore();
// const isToggled = computed(() => store.isToggled);

const screen = () => {
    store.toggle();
    store.fetch(true);
};
</script>

<template>
    <v-dialog max-width="800" max-height="700" v-model="store.isToggled" scrollable class="overflow-visible">
        <v-card class="pa-4">
            <v-row no-gutters justify="space-between">
                <v-col cols=auto>
                    <v-card-title>Technical Stock Screener</v-card-title>
                </v-col>
                <v-col cols="auto">
                    <v-btn icon="close" variant="plain" @click="store.toggle"></v-btn>
                </v-col>
            </v-row>
            <!-- Date range picker -->
            <v-row no-gutters>
                <v-col cols=auto align-self="center">
                    <v-card-text class="py-0">Show me all stocks range</v-card-text>
                </v-col>
                <v-col cols="auto">
                    <DateRangePicker @update:start-date="store.startDateChange"
                        @update:end-date="store.endDateChange" />
                </v-col>
            </v-row>
            <!-- Rules -->
            <v-img :src="'/assets/svgs/add_new_rules.svg'" alt="add new rules" class="mt-4" height="300"></v-img>
            <v-row no-gutters class="mb-4">
                <v-col align="center" class="font-weight-medium">No rules yet</v-col>
            </v-row>
            <!-- Add new rules button -->
            <v-row no-gutters class="mx-3 my-4">
                <v-btn block prepend-icon="add" variant="outlined" @click.stop="" style="border-style: dashed;"
                    height="65">Add new
                    rules
                </v-btn>
            </v-row>
            <!-- Actions button -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="bg-red mx-4" width="200">Delete All Rules</v-btn>
                <v-btn class="bg-blue-darken-3 ms-4" width="200" @click.stop="screen">Start Screening</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>