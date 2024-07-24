import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Notification } from '@/classes/Notification'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { useSearchBarStore } from '@/stores/SearchBarStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'

export enum NotificationUtils {
    DEFAULT_TIMEOUT = 5000,
    NO_TIMEOUT = -1,
}

export const useNotificationStore = defineStore('notification', () => {
    const stores = [
        useAddRuleStore(),
        useStockScreenerStore(),
        useSearchBarStore(),
        useStockChartStore(),
        useDashboardViewStore(),
    ]

    // Watch for errors in the stores
    for (const store of stores) {
        watch(store.status, (newStatus) => {
            if (newStatus.isError()) {
                const notification = new Notification(
                    newStatus.error,
                    undefined,
                    true
                )
                if (state.isToggled.value) {
                    actions.toggle()
                }
                state.notification.value = notification
                actions.setTimeout(NotificationUtils.DEFAULT_TIMEOUT)
                actions.toggle()
            }
        })
    }

    const state = {
        isToggled: ref<boolean>(false),
        notification: ref<Notification>(),
        timeout: ref<number>(NotificationUtils.DEFAULT_TIMEOUT),
    }

    const actions = {
        // Toggle the notification
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
        },
        // Set the notification message timeout value
        setTimeout(value: number): void {
            state.timeout.value = value ?? NotificationUtils.DEFAULT_TIMEOUT
        },
    }

    return {
        ...state,
        ...actions,
    }
})
