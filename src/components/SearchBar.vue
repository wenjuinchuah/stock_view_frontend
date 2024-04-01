<script setup lang="ts">
import { useSearchBarStore } from "@/stores/SearchBarStore";
import { useStockChartStore } from "@/stores/StockChartStore";
import { watch, computed, ref } from "vue";
import { StoreStatus } from "@/enums/StoreStatus";
import { Stock } from "@/interfaces/Stock";

const searchBarStore = useSearchBarStore();
const status: StoreStatus = computed(() => searchBarStore.status);
const matchedQuery: List<Stock> = computed(() => searchBarStore.matchedQuery);

const selectedStock = ref<Stock>();
const stockChartStore = useStockChartStore();


watch(selectedStock, async () => {
    if (selectedStock.value !== stockChartStore.selectedStock.value && selectedStock.value !== null) {
        stockChartStore.updateSelectedStock(selectedStock.value);
        try {
            await stockChartStore.fetch();
        } catch (error) {
            console.error(error);
        }
    }
});
</script>

<template>
    <v-autocomplete
        class="mx-4 my-1"
        rounded="lg"
        bg-color="colors.white"
        clearable
        density="compact"
        placeholder="Search for any stock"
        variant="outlined"
        append-inner-icon="search"
        menu-icon=""
        hide-details="auto"
        v-model="selectedStock"
        @update:search="searchBarStore.onInput"
        :loading="status === StoreStatus.isBusy"
        :items="matchedQuery"
        :filter="searchBarStore.filter"
        :item-title="(item) => `[${item.stockCode}] ${item.stockName}`"
        item-value="stockCode"
        no-data-text="No stock found"
        return-object
    ></v-autocomplete>
</template>
