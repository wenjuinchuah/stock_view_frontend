<script setup lang="ts">
import StockChart from '@/components/StockChart.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'
import {
    NotificationUtils,
    useNotificationStore,
} from '@/stores/NotificationStore'
import { onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { Notification } from '@/classes/Notification'
import { InternetStatus } from '@/enums/HttpStatus'

const notificationStore = useNotificationStore()
const dashboardViewStore = useDashboardViewStore()

const isAfterTradingHour = computed<boolean>(
    () => dashboardViewStore.isAfterTradingHour
)
const isDataAvailable = computed<boolean>(
    () => dashboardViewStore.isDataAvailable
)

// Set notification message
const setNotification = (message: string) => {
    const notification = new Notification(message)
    notificationStore.notification = notification
    notificationStore.setTimeout(NotificationUtils.DEFAULT_TIMEOUT)
    notificationStore.toggle()
}

// Set network error notification
const setNetworkErrorNotification = () => {
    const notification = new Notification(
        undefined,
        'You are now in offline mode.',
        true
    )
    notificationStore.notification = notification
    notificationStore.setTimeout(NotificationUtils.NO_TIMEOUT)
    notificationStore.toggle()
}

// Update internet status
const updateInternetStatus = () => {
    if (navigator.onLine == false) {
        setNetworkErrorNotification()
    } else {
        if (notificationStore.isToggled) {
            notificationStore.toggle()
        }
    }
}

// Initialize the store on mounted and add event listener for internet status
onMounted(async () => {
    await dashboardViewStore.init()
    window.addEventListener(InternetStatus.ONLINE, updateInternetStatus)
    window.addEventListener(InternetStatus.OFFLINE, updateInternetStatus)
    updateInternetStatus()
})

// Unmount the event listener for internet status
onBeforeUnmount(() => {
    window.removeEventListener(InternetStatus.ONLINE, updateInternetStatus)
    window.removeEventListener(InternetStatus.OFFLINE, updateInternetStatus)
})

// Watch the trading hour and data availability changes and set notification
watch([isAfterTradingHour, isDataAvailable], () => {
    if (isAfterTradingHour.value && isDataAvailable.value) {
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
