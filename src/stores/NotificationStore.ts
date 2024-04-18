import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Notification } from '@/classes/Notification'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { useSearchBarStore } from '@/stores/SearchBarStore'
import { useStockChartStore } from '@/stores/StockChartStore'
import { useDashboardViewStore } from '@/stores/DashboardViewStore'

export const useNotificationStore = defineStore('notification', () => {
    const stores = [
        useAddRuleStore(),
        useStockScreenerStore(),
        useSearchBarStore(),
        useStockChartStore(),
        useDashboardViewStore(),
    ]

    for (const store of stores) {
        watch(store.status, (newStatus) => {
            if (newStatus.isError()) {
                const notification = new Notification(newStatus.error, true)
                state.notification.value = notification
                actions.toggle()
            }
        })
    }

    const state = {
        isToggled: ref<boolean>(false),
        notification: ref<Notification>(),
    }

    const actions = {
        toggle(): void {
            state.isToggled.value = !state.isToggled.value
        },
    }

    return {
        ...state,
        ...actions,
    }
})
