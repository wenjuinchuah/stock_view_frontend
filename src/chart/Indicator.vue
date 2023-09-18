<template>
  <Layout title="Indicator">
    <div id="indicator-k-line" class="k-line-chart" />
    <div class="k-line-chart-menu-container">
      <span style="padding-right: 10px; padding-left: 12px">Indicator</span>
      <button v-for="type in indicators" :key="type" v-on:click="setIndicator(type.name)">
        {{ type.name.toLocaleUpperCase() }}
      </button>
    </div>
  </Layout>
</template>

<script>
import { dispose, init, registerOverlay } from "klinecharts";
import generatedDataList from "../generatedDataList";
import Layout from "../Layout.vue";

registerOverlay({
  name: "cciRange",
  lock: true,
  createPointFigures: function (_a) {
    var coordinates = _a.coordinates;
    var bounding = _a.bounding;
    var lines = [];

    for (let index = 0; index < coordinates.length; index++) {
      lines.push({
        type: "line",
        attrs: {
          coordinates: [
            {
              x: 0,
              y: coordinates[index].y,
            },
            {
              x: bounding.width,
              y: coordinates[index].y,
            },
          ],
        },
      });
    }

    return [
      {
        type: "rect",
        attrs: {
          x: coordinates[0].x,
          y: coordinates[0].y,
          width: bounding.width,
          height: coordinates[1].y - coordinates[0].y,
        },
      },
      ...lines,
    ];
  },
});

export default {
  name: "ChartIndicator",
  components: {
    Layout,
  },
  data: function () {
    return {
      indicators: [
        {
          name: "cci",
          overlays: ["cciRange"],
          length: [20],
          overbought: 100,
          oversold: -100,
          date_from: 1694448000000,
          date_to: 1694966400000,
        },
        {
          name: "macd",
          length: [12, 26, 9],
        },
        {
          name: "kdj",
          length: [9, 3, 3],
        },
      ],
    };
  },
  mounted: async function () {
    this.dataList = await generatedDataList(1155);
    this.chart = init("indicator-k-line");
    this.indicator = this.indicators[0];
    this.paneId = this.chart.createIndicator(this.indicator.name.toLocaleUpperCase());
    this.chart.applyNewData(this.dataList);
  },
  methods: {
    setIndicator: function (name) {
      this.indicator = this.indicators.find((indicator) => indicator.name == name);

      // Create indicator
      this.chart.createIndicator(
        {
          name: name.toLocaleUpperCase(),
          calcParams: this.indicator.length,
        },
        false,
        {
          id: this.paneId,
        }
      );

      // Add overlay
      this.addOverlay(name);
    },
    addOverlay: function (name) {
      const cciOverlay = this.indicators.find((indicator) => indicator.name == "cci");

      // Remove cci overlay
      if (name != "cci" && cciOverlay.overlayId != null) {
        for (var overlay in cciOverlay.overlays) {
          this.chart.removeOverlay({
            name: cciOverlay.overlays[overlay],
          });
        }
        cciOverlay.overlayId = null;
      }

      // Create cci overlay
      if (this.indicator.name == "cci" && cciOverlay.overlayId == null) {
        cciOverlay.overlayId = this.chart.createOverlay(
          {
            name: cciOverlay.overlays[0],
            points: [
              {
                value: cciOverlay.overbought,
              },
              {
                value: cciOverlay.oversold,
              },
              {
                value: 0,
              },
            ],
          },
          this.paneId
        );
      }
    },
    unmounted: function () {
        dispose("indicator-k-line");
    },
};
</script>
