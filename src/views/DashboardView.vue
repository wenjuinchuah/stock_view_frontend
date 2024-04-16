<script setup lang="ts">
import StockChart from '@/components/StockChart.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { onMounted, watch, computed } from 'vue'
import { Notification } from '@/classes/Notification'

const notificationStore = useNotificationStore()

const dashboardViewStore = useDashboardViewStore()
const isAfterTradingHour = computed<boolean>(
    () => dashboardViewStore.isAfterTradingHour
)

const setNotification = (message: string) => {
    const notification = new Notification(message)
    notificationStore.notification = notification
    notificationStore.toggle()
}

onMounted(async () => {
    await dashboardViewStore.init()
})

watch(isAfterTradingHour, () => {
    if (isAfterTradingHour.value) {
        setNotification('Fetching data from the server, it may take a while.')
    } else if (dashboardViewStore.responseMessage !== '') {
        setNotification(dashboardViewStore.responseMessage)
    }
})
</script>

<template>
    <v-container fluid>
        <StockChart />
        <NotificationToast />
    </v-container>
</template>
