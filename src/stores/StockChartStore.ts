import { defineStore } from 'pinia'
import { PriceList } from '@/interfaces/PriceList'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'

export const useStockChartStore = defineStore('stockChart', () => {
  const state = {
    priceList: ref<List<PriceList>>([]),
    status: ref(StoreStatus.isIdle)
  }

  const actions = {
    async fetch(stockCode: string = '0001') {
      state.status.value = StoreStatus.isBusy
      try {
        const response = await HttpService.get(`/stock/get?stock_code=${stockCode}`)
        state.priceList.value = PriceList.fromJson(response.data)
        state.status.value = StoreStatus.isIdle
      } catch (error) {
        state.status.value = StoreStatus.isError
        throw error
      }
    }
  }

  return {
    ...state,
    ...actions
  }
})
