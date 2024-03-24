<script setup lang="ts">
import { computed } from "vue";
import { useStockChartStore } from "@/stores/StockChartStore";
import { PriceList } from "@/types/PriceList";
import { Stock } from "@/types/Stock";

const stockChartStore = useStockChartStore();
const selectedStock: Stock = computed(() => stockChartStore.selectedStock);
const priceChange: number = computed(() => stockChartStore.priceChange);
const percentageChange: number = computed(() => stockChartStore.percentageChange);
const priceList = computed(() =>
    stockChartStore.priceList ? stockChartStore.priceList.slice(-1) : null
);
const lastPrice: PriceList = computed(() =>
    priceList.value ? priceList.value[0] : null
);

const stockDetailsMap = computed(() => {
    if (!lastPrice.value) {
        return {};
    }
    return {
        Close: lastPrice.value.close,
        Open: lastPrice.value.open,
        High: lastPrice.value.high,
        Low: lastPrice.value.low,
    };
});
</script>

<template>
    <v-container v-if="lastPrice && selectedStock">
        <v-row no-gutters justify="space-between" class="font-weight-medium">
            <v-col cols="auto">{{ selectedStock.stockName }}</v-col>
            <v-col cols="auto" :class="priceChange < 0 ? 'text-red' : 'text-green'"
                >{{ priceChange > 0 ? "+" : "" }}{{ priceChange.toFixed(3) }}
                <span
                    cols="auto"
                    :class="percentageChange < 0 ? 'text-red' : 'text-green'"
                    >({{ priceChange > 0 ? "+" : ""
                    }}{{ percentageChange.toFixed(3) }}%)</span
                ></v-col
            >
        </v-row>
        <v-row no-gutters align="center">
            <v-col cols="auto" class="text-subtitle-2 text-grey-darken-1">{{
                selectedStock.stockCode
            }}</v-col>
            <v-col cols="auto" v-if="selectedStock.isShariah"
                ><v-btn
                    icon="dark_mode"
                    size="x-small"
                    variant="outlined"
                    color="green-darken-3"
                    density="comfortable"
                    class="mx-1 mb-1"
                ></v-btn
            ></v-col>
        </v-row>
        <v-row no-gutters
            ><v-col class="text-caption text-grey mb-1">
                {{ selectedStock.category }}</v-col
            ></v-row
        >
        <v-row no-gutters
            ><v-col class="text-caption text-grey-darken-2 mt-2">
                Last Updated:
                {{
                    new Date(lastPrice.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                }}</v-col
            ></v-row
        >
        <v-row
            no-gutters
            v-for="(value, key) in stockDetailsMap"
            :key="key"
            justify="space-between"
            class="text-grey-darken-2 mt-1"
        >
            <v-col cols="auto">{{ key }}</v-col>
            <v-col cols="auto"
                >{{ value.toFixed(3) }} <span class="text-body-2">MYR</span></v-col
            >
        </v-row>
    </v-container>
</template>
