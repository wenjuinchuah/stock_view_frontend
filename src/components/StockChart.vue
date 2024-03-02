<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { init, dispose } from "klinecharts";
import { useStockChartStore } from "@/stores/StockChartStore";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";

const store = useStockChartStore();
const settingsStore = useSettingsMenuStore();
const stockName = store.stockName;
const chartData = store.chartData;

const stockChart = ref(null);

const handleResize = () => {
    if (window.resizeTimer) {
        clearTimeout(window.resizeTimer);
    }
    window.resizeTimer = setTimeout(() => {
        stockChart.value.resize();
    }, 200);
};

onMounted(() => {
    const chart = init("chart");
    stockChart.value = chart;
    chart.applyNewData(chartData);
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
});

onUnmounted(() => {
    dispose("chart");

    window.removeEventListener("resize", handleResize);
});

watch(
    () => settingsStore.isToggled,
    () => {
        setTimeout(() => {
            stockChart.value.resize();
        }, 400);
    }
);
</script>

<template>
    <div id="stock-info" class="mx-4 mt-4 d-flex column-gap-2 align-items-center">
        <img
            src="https://cdn.zonebourse.com/static/instruments-squared-6491196"
            :alt="stockName"
            class="rounded-circle d-flex"
            style="width: 20px; height: 20px"
        />
        <div>{{ stockName }}</div>
    </div>
    <div id="chart" class="my-4 me-2 col"></div>
</template>

<style>
main {
    z-index: -1;
}

#chart {
    position: relative;
    z-index: 1;
    height: calc(100vh - 3rem);
}

#stock-info {
    position: absolute;
    z-index: 2;
}
</style>
