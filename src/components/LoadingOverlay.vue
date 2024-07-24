<script setup lang="ts">
import HttpService from '@/services/HttpService'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import { computed, ref } from 'vue'

const dashboardViewStore = useDashboardViewStore()
const stockChartStore = useStockChartStore()

const isDataAvailable = computed(() => dashboardViewStore.isDataAvailable)
const totalNoOfStocks = computed(() => dashboardViewStore.totalNoOfStocks)
const showOverlay = computed(() => !isDataAvailable.value || false)
const fetchingPercentage = computed(
    () => (currentFetchCount.value / totalNoOfStocks.value) * 100 ?? 0
)

const currentFetchCount = ref<number>(0)

// Get last pricelist index every 10 seconds to show the loading progress
setInterval(async () => {
    if (!isDataAvailable.value) {
        const response = await HttpService.get(
            '/price_list/get_last_updated_price_list_index'
        )
        currentFetchCount.value = response.data.data
        if (currentFetchCount.value === totalNoOfStocks.value) {
            stockChartStore.fetch()
        }
    }
}, 10000)
</script>

<template>
    <v-dialog max-width="500" persistent v-model="showOverlay">
        <v-card title="System initializing ">
            <v-img
                :src="'/assets/gifs/hourglass.gif'"
                alt="hourglass loading"
                height="64"
            ></v-img>
            <v-card-subtitle align="center" opacity="10" class="mt-4">
                It might takes a while, please wait...
            </v-card-subtitle>
            <v-card-text align="center" class="mb-4">
                {{ currentFetchCount }}/{{ totalNoOfStocks }} ({{
                    fetchingPercentage.toFixed(0)
                }}%)
            </v-card-text>
            <v-progress-linear
                :model-value="fetchingPercentage"
            ></v-progress-linear>
        </v-card>
    </v-dialog>
</template>
