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
    createPointFigures: function (_a) {
        var coordinates = _a.coordinates;
        var bounding = _a.bounding;
        return [{
            type: 'rect',
            attrs: {
                x: coordinates[0].x,
                y: coordinates[0].y,
                width: bounding.width,
                height: coordinates[1].y - coordinates[0].y,
            }
        }];
    },
});

export default {
    name: "ChartIndicator",
    components: {
        Layout
    },
    data: function () {
        return {
            subIndicators: ["CCI", "MACD", "KDJ"],
        };
    },
    mounted: async function () {
        const dataList = await generatedDataList(1155);
        this.chart = init("indicator-k-line");
        this.paneId = this.chart.createIndicator(this.subIndicators[0]);
        this.chart.applyNewData(dataList);
    },
    methods: {
        setSubIndicator: function (name, params) {
            this.chart.createIndicator(name, false, {
                id: this.paneId
            });
            if (name == "CCI" && this.overlayId == null) {
                this.overlayId = this.chart.createOverlay({
                    name: "cciRange",
                    points: [{
                        value: 100,
                    }, {
                        value: -100,
                    }],
                }, this.paneId);
            }
            if (name != "CCI") {
                this.chart.removeOverlay({
                    name: "cciRange"
                });
                this.overlayId = null;
            }
        },
    },
    unmounted: function () {
        dispose("indicator-k-line");
    },
};
</script>
