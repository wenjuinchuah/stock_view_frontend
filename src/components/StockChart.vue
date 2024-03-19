<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { init, dispose } from "klinecharts";
import { useStockChartStore } from "@/stores/StockChartStore";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { StoreStatus } from "@/enums/StoreStatus";
import { Toast } from "bootstrap";

const stockChartStore = useStockChartStore();
const settingsMenuStore = useSettingsMenuStore();

const priceList = computed(() => stockChartStore.priceList);
const status = computed(() => stockChartStore.status);
const isSettingsMenuToggled = computed(() => settingsMenuStore.isToggled);

const stockChart = ref(null);

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
        if (priceList.value != null) {
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
</script>

<template>
    <div
        id="stock-info"
        class="mx-4 mb-4 d-flex column-gap-2 align-items-center"
        v-if="priceList.length > 0"
    >
        <img
            src="https://cdn.zonebourse.com/static/instruments-squared-6491196"
            :alt="1"
            class="rounded-circle d-flex"
            style="width: 20px; height: 20px"
        />
        <div>
            {{ priceList[0].stockCode }}
        </div>
    </div>
    <div id="chart" v-if="priceList.length > 0"></div>
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
