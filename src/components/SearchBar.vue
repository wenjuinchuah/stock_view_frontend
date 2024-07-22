<script setup lang="ts">
import { useSearchBarStore } from '@/stores/SearchBarStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import { watch, computed, ref } from 'vue'
import { Stock } from '@/classes/Stock'

const searchBarStore = useSearchBarStore()
const matchedQuery = computed<Stock[]>(() => searchBarStore.matchedQuery)
const storeSelectedStock = computed<Stock | undefined>(
    () => stockChartStore.selectedStock
)

const selectedStock = ref<Stock>()
const stockChartStore = useStockChartStore()

// Watch the selected stock changes and update the stock chart
watch(selectedStock, async () => {
    if (
        selectedStock.value !== storeSelectedStock.value &&
        selectedStock.value !== null
    ) {
        await stockChartStore.fetch(selectedStock.value?.stockCode)
    }
})
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
        :loading="searchBarStore.status.isBusy()"
        :items="matchedQuery"
        :filter="searchBarStore.filter"
        :item-title="(item) => `[${item.stockCode}] ${item.stockName}`"
        item-value="stockCode"
        no-data-text="No stock found"
        return-object
    ></v-autocomplete>
</template>
@/classes/Stock
