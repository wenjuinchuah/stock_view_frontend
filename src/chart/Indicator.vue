<template>
  <Layout title="技术指标">
    <div id="indicator-k-line" class="k-line-chart" />
    <div class="k-line-chart-menu-container">
      <span style="padding-right: 10px; padding-left: 12px">Sub Indicator</span>
      <button
        v-for="type in subIndicators"
        :key="type"
        v-on:click="setSubIndicator(type)"
      >
        {{ type }}
      </button>
    </div>
  </Layout>
</template>

<script>
import { dispose, init, registerIndicator } from "klinecharts";
import generatedDataList from "../generatedDataList";
import Layout from "../Layout.vue";

registerIndicator({
});

export default {
  name: "ChartIndicator",
  components: { Layout },
  data: function () {
    return {
      subIndicators: ["VOL", "MACD", "KDJ"],
      stock_code: null,
    };
  },
  mounted: async function () {
    const dataList = await generatedDataList(1155);
    this.chart = init("indicator-k-line");
    this.paneId = this.chart.createIndicator("VOL");
    this.chart.applyNewData(dataList);
  },
  methods: {
    setSubIndicator: function (name) {
      this.chart.createIndicator(name, false, { id: this.paneId });
    },
  },
  unmounted: function () {
    dispose("indicator-k-line");
  },
};
</script>
