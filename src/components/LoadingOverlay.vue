<script setup lang="ts">
import HttpService from '@/services/HttpService'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import { computed, onMounted, ref, watch } from 'vue'

const dashboardViewStore = useDashboardViewStore()
const stockChartStore = useStockChartStore()
const currentFetchCount = ref<number>(0)

const isDataAvailable = computed(() => dashboardViewStore.isDataAvailable)
const totalNoOfStocks = computed(() => dashboardViewStore.totalNoOfStocks)
const showOverlay = computed(() => !isDataAvailable.value || false)

const fetchingPercentage = () => {
    if (totalNoOfStocks.value === 0) {
        return 0
    }
    return (currentFetchCount.value / totalNoOfStocks.value) * 100
}

const fetchLastStockDataIndex = async () => {
    if (showOverlay.value) {
        try {
            const response = await HttpService.get(
                '/price_list/get_last_updated_price_list_index'
            )
            currentFetchCount.value = response.data.data
        } catch (error) {
            console.log(error)
        }
    }
}

watch([currentFetchCount, showOverlay], ([newIndex, newShowOverlayFlag]) => {
    if (newIndex < totalNoOfStocks.value || newShowOverlayFlag) {
        // Wait for 5 seconds before fetching again
        setTimeout(() => {
            fetchLastStockDataIndex()
        }, 5000)
    } else {
        stockChartStore.fetch()
    }
})
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
                    fetchingPercentage().toFixed(0)
                }}%)
            </v-card-text>
            <v-progress-linear
                :model-value="fetchingPercentage()"
            ></v-progress-linear>
        </v-card>
    </v-dialog>
</template>
