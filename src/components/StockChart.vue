<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from "vue";
import { init, dispose } from "klinecharts";
import { useStockChartStore } from "@/stores/StockChartStore";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { PriceList } from "@/types/PriceList";
import { Stock } from "@/types/Stock";
import "@/services/FormatService";

const stockChartStore = useStockChartStore();
const settingsMenuStore = useSettingsMenuStore();

const priceList: List<PriceList> = computed(() => stockChartStore.priceList);
const selectedStock: Stock = computed(() => stockChartStore.selectedStock);
const isPriceListEmpty = computed(() => stockChartStore.isPriceListEmpty());
const isSettingsMenuToggled = computed(() => settingsMenuStore.isToggled);

const stockChart = ref();

const handleResize = () => {
    if (window.resizeTimer) {
        clearTimeout(window.resizeTimer);
    }
    window.resizeTimer = setTimeout(() => {
        stockChart.value.resize();
    }, 200);
};

onMounted(async () => {
    try {
        await stockChartStore.fetch();
        if (!isPriceListEmpty.value) {
            const chart = init("chart");
            stockChart.value = chart;
            chart.applyNewData(priceList.value);
            chart.setStyles({
                candle: {
                    tooltip: {
                        text: {
                            marginTop: 32,
                            marginLeft: 24,
                        },
                    },
                },
            });
            window.addEventListener("resize", handleResize);
        }
    } catch (error) {
        console.log(error);
    }
});

onUnmounted(() => {
    dispose("chart");
    window.removeEventListener("resize", handleResize);
});

watch(isSettingsMenuToggled, () => {
    setTimeout(() => stockChart.value.resize(), 400);
});

watch(priceList, () => {
    if (stockChart.value) {
        stockChart.value.applyNewData(priceList.value);
    }
});
</script>

<template>
    <div id="stock-info" class="mx-4 mb-4 d-flex column-gap-2 align-items-center" v-if="!isPriceListEmpty && selectedStock">
        <p class="font-weight-medium">
            [{{ selectedStock.stockCode }}] {{ selectedStock.stockName }}
        </p>
        <p class="text-grey">{{ selectedStock.stockFullName.capitalize() }}</p>
    </div>
    <div id="chart" v-if="!isPriceListEmpty"></div>
</template>

<style>
main {
    z-index: -1;
}

#chart {
    position: relative;
    z-index: 1005;
    height: calc(100vh - 3rem);
    width: 100%;
}

#stock-info {
    position: absolute;
    z-index: 2;
}
</style>
