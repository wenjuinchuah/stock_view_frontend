import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'

export const useSearchBarStore = defineStore('searchBar', () => {
  const state = {
    // stockList: ref<List<Stock>>([]),
    status: ref(StoreStatus.isIdle)
  }

  const actions = {}

  return {
    ...state,
    ...actions
  }
})
