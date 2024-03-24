<script setup lang="ts">
import { useStockScreenerStore } from "@/stores/StockScreenerStore";
import DateRangePicker from "@/components/DateRangePicker.vue";

const store = useStockScreenerStore();

</script>

<template>
    <v-dialog max-width="800" min-height="700" v-model="store.isToggled" scrollable class="overflow-visible">
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
                    <DateRangePicker />
                </v-col>
            </v-row>
            <!-- Rules -->
            <!-- Add new rules button -->
            <v-row no-gutters class="mx-3 my-4">
                <v-btn block prepend-icon="add" variant="outlined" @click.stop="" style="border-style: dashed;">Add new
                    rules
                </v-btn>
            </v-row>
            <!-- Actions button -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="bg-red mx-4" width="200">Delete All Rules</v-btn>
                <v-btn class="bg-blue-darken-3 ms-4" width="200">Start Screening</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>