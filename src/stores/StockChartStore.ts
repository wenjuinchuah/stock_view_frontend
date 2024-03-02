import { defineStore } from 'pinia'
import { ref } from 'vue'
import chartDataJson from '@/assets/chart_data.json'

export const useStockChartStore = defineStore('stockChart', () => {
  const stockName = ref('MAYBANK')
  const chartData = chartDataJson

  return {
    stockName,
    chartData
  }
})
