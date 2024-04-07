<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from 'vue'
import { init, dispose } from 'klinecharts'
import { useStockChartStore } from '@/stores/StockChartStore'
import { useSettingsMenuStore } from '@/stores/SettingsMenuStore'
import '@/services/FormatService'

const stockChartStore = useStockChartStore()
const settingsMenuStore = useSettingsMenuStore()

const priceList = computed(() => stockChartStore.priceList)
const selectedStock = computed(() => stockChartStore.selectedStock)
const isPriceListEmpty = computed(() => stockChartStore.isPriceListEmpty())
const isSettingsMenuToggled = computed(() => settingsMenuStore.isToggled)

const stockChart = ref()

const handleResize = () => {
    window.onresize = () => {
        setTimeout(() => {
            stockChart.value.resize()
        }, 250)
    }
}

onMounted(async () => {
    await stockChartStore.fetch()
    if (!isPriceListEmpty.value) {
        const chart = init('chart')
        if (chart) {
            stockChart.value = chart
            chart.applyNewData(priceList.value || [])
            chart.setStyles({
                candle: {
                    tooltip: {
                        text: {
                            marginTop: 54,
                            marginLeft: 16,
                        },
                    },
                },
            })
            chart.createIndicator('CCI')
            window.addEventListener('resize', handleResize)
        }
    }
})

onUnmounted(() => {
    dispose('chart')
    window.removeEventListener('resize', handleResize)
})

watch(isSettingsMenuToggled, () => {
    setTimeout(() => stockChart.value.resize(), 400)
})

watch(priceList, () => {
    if (stockChart.value) {
        stockChart.value.applyNewData(priceList.value)
    }
})
</script>

<template>
    <template v-if="stockChartStore.status.isBusy()">
        <v-infinite-scroll></v-infinite-scroll>
    </template>
    <template v-if="!isPriceListEmpty && selectedStock">
        <v-container class="pa-0 mx-4 bg-white" id="stock-info">
            <v-row no-gutters class="font-weight-medium">
                [{{ selectedStock.stockCode }}]
                {{ selectedStock.stockName }}
            </v-row>
            <v-row no-gutters class="text-grey">
                {{ selectedStock.stockFullName.capitalize() }}
            </v-row>
        </v-container>
        <div id="chart"></div>
    </template>
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
    z-index: 10000;
}
</style>
