import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'

export const useStockScreenerStore = defineStore('stockScreener', () => {
  const state = {
    status: ref<StoreStatus>(StoreStatus.isIdle),
    isToggled: ref<boolean>(false)
  }

  const actions = {
    async fetch() {
      state.status = StoreStatus.isBusy
      try {
        // const response = await fetch('/stock/screener')
        // state.stockList = await response.json()
        state.status = StoreStatus.isIdle
      } catch (error) {
        state.status = StoreStatus.isError
        throw error
      }
    },
    toggle() {
      state.isToggled.value = !state.isToggled.value
    }
  }

  return {
    ...state,
    ...actions
  }
})
