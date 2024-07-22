<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch } from 'vue'
import { init, dispose, type Chart, utils } from 'klinecharts'
import { useStockChartStore } from '@/stores/StockChartStore'
import '@/services/FormatService'
import type { Stock } from '@/classes/Stock'

const stockChartStore = useStockChartStore()

const selectedStock = computed<Stock | undefined>(
    () => stockChartStore.selectedStock
)
const stockChart = computed<Chart | undefined>(() => stockChartStore.stockChart)

// Resize the chart when the window is resized
const handleResize = () => {
    window.onresize = () => {
        setTimeout(() => {
            if (stockChart.value) {
                stockChart.value.resize()
            }
        }, 250)
    }
}

// Initialize the stock chart
const initialize = async () => {
    if (!stockChart.value) {
        const chart = init('chart', {
            customApi: {
                formatDate: (
                    dateTimeFormat: Intl.DateTimeFormat,
                    timestamp: number
                ) => {
                    return utils.formatDate(
                        dateTimeFormat,
                        timestamp,
                        'YYYY-MM-DD'
                    )
                },
            },
            styles: {
                candle: {
                    tooltip: {
                        custom: [
                            { title: 'Date: ', value: '{time}' },
                            { title: 'open', value: '{open}' },
                            { title: 'high', value: '{high}' },
                            { title: 'low', value: '{low}' },
                            { title: 'close', value: '{close}' },
                            { title: 'volume', value: '{volume}' },
                        ],
                        text: {
                            marginTop: 58,
                            marginLeft: 16,
                        },
                    },
                },
            },
        })
        await stockChartStore.init(chart as Chart)

        window.addEventListener('resize', handleResize)
    }
}

// Initialize the stock chart when the component is mounted
onMounted(() => {
    initialize()
})

// Dispose the stock chart when the component is unmounted
onUnmounted(() => {
    dispose(stockChartStore.stockChart as Chart)
    window.removeEventListener('resize', handleResize)
})

// Watch the stock chart changes and initialize the stock chart
watch(stockChart, () => {
    if (!stockChart.value) {
        initialize()
    }
})
</script>

<template>
    <template v-if="stockChartStore.status.isBusy()">
        <v-infinite-scroll></v-infinite-scroll>
    </template>
    <template v-else-if="stockChartStore.status.isIdle() && selectedStock">
        <v-container class="pa-0 mx-4 bg-white" id="stock-info">
            <v-row no-gutters class="font-weight-medium">
                [{{ selectedStock.stockCode }}]
                {{ selectedStock.stockName }}
            </v-row>
            <v-row no-gutters class="text-grey-darken-1">
                <v-col cols="auto">
                    {{ selectedStock.stockFullName.capitalize() }}</v-col
                >
                <v-col cols="auto" class="mx-3"
                    ><v-chip
                        size="x-small"
                        variant="tonal"
                        color="grey-darken-3"
                        class="font-weight-bold"
                        >Sector:
                        {{ selectedStock.category?.capitalize() }}</v-chip
                    ></v-col
                >
            </v-row>
        </v-container>
    </template>
    <div id="chart"></div>
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
