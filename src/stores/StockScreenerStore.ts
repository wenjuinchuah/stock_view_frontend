import { defineStore } from 'pinia'
import { StoreStatus } from '@/enums/StoreStatus'
import { StockScreener } from '@/interfaces/StockScreener'
import { Stock } from '@/interfaces/Stock'
import { PriceList } from '@/interfaces/PriceList'
import { ref } from 'vue'
import HttpService from '@/services/HttpService'

export const useStockScreenerStore = defineStore('stockScreener', () => {
  const state = {
    status: ref<StoreStatus>(StoreStatus.isIdle),
    isToggled: ref<boolean>(false),
    stockScreener: ref<StockScreener>({
      startDate: new Date().getTime() / 1000 - 31536000,
      endDate: new Date().getTime() / 1000
    }),
    stockDetails: ref<List<Stock>>([]),
    priceList: ref<Record<string, List<PriceList>>>({})
  }

  const actions = {
    async fetch(refresh: boolean = false) {
      if (refresh) {
        state.stockDetails.value = []
        state.priceList.value = {}
      }
      state.status.value = StoreStatus.isBusy
      try {
        const response = await HttpService.post(
          '/stock_screener/screen',
          StockScreener.toJson(state.stockScreener.value)
        )
        state.stockScreener.value = StockScreener.fromJson(response.data)

        if (state.stockScreener.value.result.length > 0) {
          state.stockScreener.value.result.forEach(async (stockCode) => {
            const response2 = await HttpService.get(`/stock/details/get?stock_code=${stockCode}`)
            const response3 = await HttpService.get(`/stock/get?stock_code=${stockCode}`)
            state.stockDetails.value.push(Stock.fromJson(response2.data))
            state.priceList.value[stockCode] = PriceList.fromJson(response3.data)
            state.status.value = StoreStatus.isIdle
          })
        }
      } catch (error) {
        state.status.value = StoreStatus.isError
        throw error
      }
    },
    toggle() {
      state.isToggled.value = !state.isToggled.value
    },
    startDateChange(date: Date) {
      state.stockScreener.value.startDate = date.getTime() / 1000
    },
    endDateChange(date: Date) {
      state.stockScreener.value.endDate = date.getTime() / 1000
    },
    calculatePercentageChange(priceList: List<PriceList>) {
      if (priceList.length < 2) {
        return 0
      }

      const latestPrice = priceList[priceList.length - 1].close
      const previousPrice = priceList[priceList.length - 2].close

      return ((latestPrice - previousPrice) / previousPrice) * 100
    },
    calculatePriceChange(priceList: List<PriceList>) {
      if (priceList.length < 2) {
        return 0
      }

      const latestPrice = priceList[priceList.length - 1].close
      const previousPrice = priceList[priceList.length - 2].close

      return latestPrice - previousPrice
    },
    getLastOpenPrice(priceList: List<PriceList>) {
      return priceList[priceList.length - 1].open
    },
    getLastClosePrice(priceList: List<PriceList>) {
      return priceList[priceList.length - 1].close
    }
  }

  return {
    ...state,
    ...actions
  }
})
