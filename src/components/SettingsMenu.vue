<script setup lang="ts">
import { ref, computed } from "vue";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { useStockChartStore } from "@/stores/StockChartStore";
import { useStockScreenerStore } from "@/stores/StockScreenerStore";
import SearchBar from "@/components/SearchBar.vue";
import StockDetails from "@/components/StockDetails.vue";
import StockScreener from "@/components/StockScreener.vue";
import { StoreStatus } from "@/enums/StoreStatus";

const settingsMenuStore = useSettingsMenuStore();
const drawerToggled: bool = ref(false);

const stockChartStore = useStockChartStore();
const isPriceListEmpty = computed(() => stockChartStore.isPriceListEmpty());

const stockScreenerStore = useStockScreenerStore();
const screenedStock = computed(() => stockScreenerStore.stockDetails);
const stockPriceList = computed(() => stockScreenerStore.priceList);

const toggleSettingsMenu = () => {
    settingsMenuStore.toggle();
    drawerToggled.value = !drawerToggled.value;
};

const toggleScreener = () => {
    stockScreenerStore.toggle();
};
</script>

<template>
    <v-btn id="settingsBtn" prepend-icon="settings" variant="outlined" @click.stop="toggleSettingsMenu"
        class="mt-4 mx-5 px-4 position-absolute end-0 bg-white">Settings
    </v-btn>
    <v-navigation-drawer v-model="drawerToggled" permanent location="right" width="280">
        <v-btn icon="close" variant="plain" @click.stop="toggleSettingsMenu"></v-btn>
        <SearchBar />
        <v-container class="py-0">
            <v-row no-gutters justify="space-between">
                <v-col cols="auto" align-self="center">
                    <p class="font-weight-medium m-0">Stock Screener</p>
                </v-col>
                <v-col cols="auto">
                    <v-btn variant="text" class="text-blue-darken-3" id="edit" @click.stop="toggleScreener">Edit</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <template v-if="screenedStock.length > 0">
            <!-- Placeholder -->
            <v-row no-gutters justify="space-between" class="px-4 text-center text-caption text-grey-darken-2">
                <v-col cols="4">Symbol</v-col>
                <v-col cols="3">Open</v-col>
                <v-col cols="3">Close</v-col>
                <v-col cols="0"></v-col>
            </v-row>
            <!-- Render stock information -->
            <v-list lines="one">
                <v-list-group v-for="(stock, key) in screenedStock" :key="key" :value="key" class="font-weight-medium">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" density="comfortable" slim>
                            <v-list-item-title>
                                <v-row no-gutters justify="space-between">
                                    <v-col cols="5">{{ stock.stockName }}</v-col>
                                    <v-col cols="3">{{
        stockScreenerStore.getLastOpenPrice(stockPriceList[stock.stockCode]).toFixed(3)
    }}</v-col>
                                    <v-col cols="3">{{
            stockScreenerStore.getLastClosePrice(stockPriceList[stock.stockCode]).toFixed(3)
        }}</v-col>
                                </v-row>
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list-group>
            </v-list>
        </template>

        <template v-else-if="stockScreenerStore.status === StoreStatus.isBusy">
            <v-infinite-scroll></v-infinite-scroll>
        </template>

        <template v-else-if="screenedStock.length === 0 && stockScreenerStore.status === StoreStatus.isIdle">
            <v-img :src="'/assets/svgs/search_not_found.svg'" alt="search no found" class="mt-3" height="154"></v-img>
            <v-row no-gutters class="mb-2">
                <v-col align="center" class="font-weight-medium">No stock found</v-col>
            </v-row>
        </template>
        <StockScreener />
        <!-- <div class="position-absolute bottom-0 bg-white" style="width: 280px"> -->
        <div>
            <v-divider thickness="4" v-if="!isPriceListEmpty" class="mb-0"></v-divider>
            <StockDetails />
            <!-- Chart Settings -->
            <v-row no-gutters class="p-3"><v-btn block id="settingsBtn" prepend-icon="settings" variant="outlined"
                    @click.stop="" class="bg-white">Chart
                    Settings
                </v-btn>
            </v-row>
        </div>
    </v-navigation-drawer>
</template>

<style>
.v-btn {
    z-index: 10;
    text-transform: unset !important;
}
</style>
