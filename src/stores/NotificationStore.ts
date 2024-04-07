import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Notification } from '@/classes/Notification'
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { useSearchBarStore } from '@/stores/SearchBarStore'
import { useSettingsMenuStore } from '@/stores/SettingsMenuStore'
import { useStockChartStore } from '@/stores/StockChartStore'

export const useNotificationStore = defineStore('notification', () => {
    const stores = [
        useAddRuleStore(),
        useStockScreenerStore(),
        useSearchBarStore(),
        useSettingsMenuStore(),
        useStockChartStore(),
    ]

    for (const store of stores) {
        watch(store.status, (newStatus) => {
            if (newStatus.isError()) {
                const notification = new Notification(
                    actions.getCurrentDate(),
                    newStatus.error,
                    true
                )
                state.notification.value = notification
                state.toggle.value = true
            }
        })
    }

    const state = {
        toggle: ref<boolean>(false),
        notification: ref<Notification>(),
    }

    const actions = {
        getCurrentDate(): string {
            const date = new Date()
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            })
        },
    }

    return {
        ...state,
        ...actions,
    }
})
