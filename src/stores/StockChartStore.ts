import { defineStore } from 'pinia'
import { PriceList } from '@/interfaces/PriceList'
import { Stock } from '@/interfaces/Stock'
import HttpService from '@/services/HttpService'
import { StoreStatus } from '@/enums/StoreStatus'
import { ref } from 'vue'

export const useStockChartStore = defineStore('stockChart', () => {
  const defaultStockCode = ref('0001')

  const state = {
    priceList: ref<List<PriceList>>(),
    status: ref<StoreStatus>(StoreStatus.isIdle),
    selectedStock: ref<Stock>(),
    priceChange: ref<number>(0),
    percentageChange: ref<number>(0)
  }

  const actions = {
    async fetch(
      stockCode: string = state.selectedStock.value
        ? state.selectedStock.value.stockCode
        : defaultStockCode.value
    ) {
      state.status.value = StoreStatus.isBusy
      try {
        const response = await HttpService.get(`/stock/get?stock_code=${stockCode}`)
        state.priceList.value = PriceList.fromJson(response.data)
        state.priceList.value.sort((a, b) => a.timestamp - b.timestamp)

        const response2 = await HttpService.get(`/stock/details/get?stock_code=${stockCode}`)
        state.selectedStock.value = Stock.fromJson(response2.data)

        state.priceChange.value = methods.calculatePriceChange()
        state.percentageChange.value = methods.calculatePercentageChange()

        state.status.value = StoreStatus.isIdle
      } catch (error) {
        state.status.value = StoreStatus.isError
        throw error
      }
    },
    isPriceListEmpty() {
      if (state.priceList.value == null && state.status.value === StoreStatus.isIdle) {
        return true
      }
    },
    updateSelectedStock(stock: Stock) {
      state.selectedStock.value = stock
    }
  }

  const methods = {
    calculatePercentageChange() {
      const priceList = state.priceList.value
      if (priceList.length < 2) {
        return 0
      }

      const latestPrice = priceList[priceList.length - 1].close
      const previousPrice = priceList[priceList.length - 2].close

      return ((latestPrice - previousPrice) / previousPrice) * 100
    },
    calculatePriceChange() {
      const priceList = state.priceList.value
      if (priceList.length < 2) {
        return 0
      }

      const latestPrice = priceList[priceList.length - 1].close
      const previousPrice = priceList[priceList.length - 2].close

      return latestPrice - previousPrice
    }
  }

  return {
    ...state,
    ...actions
  }
})
