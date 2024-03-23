<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from "vue";
import { init, dispose } from "klinecharts";
import { useStockChartStore } from "@/stores/StockChartStore";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { PriceList } from "@/types/PriceList";
import { Stock } from "@/types/Stock";

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
    <div
        id="stock-info"
        class="mx-4 mb-4 d-flex column-gap-2 align-items-center"
        v-if="!isPriceListEmpty"
    >
        <!-- <img
            src="https://cdn.zonebourse.com/static/instruments-squared-6491196"
            :alt="1"
            class="rounded-circle d-flex"
            style="width: 20px; height: 20px"
        /> -->
        <p class="font-weight-medium" v-if="selectedStock">
            [{{ selectedStock.stockCode }}] {{ selectedStock.stockName }}
        </p>
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
