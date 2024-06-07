<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsMenuStore } from '@/stores/SettingsMenuStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import { useChartSettingsStore } from '@/stores/ChartSettingsStore'
import SearchBar from '@/components/SearchBar.vue'
import StockScreener from '@/components/StockScreener.vue'
import ChartSettings from '@/components/ChartSettings.vue'
import type { StockDetails } from '@/classes/StockDetails'

const chartSettingsStore = useChartSettingsStore()
const settingsMenuStore = useSettingsMenuStore()

const stockScreenerStore = useStockScreenerStore()
const screenerResult = computed<StockDetails[]>(
    () => stockScreenerStore.screenerResult
)

const loadMore = (entry: IntersectionObserverEntry) => {
    if (entry && stockScreenerStore.stockScreener.lastStockCode !== '9997') {
        stockScreenerStore.fetch()
    }
}

const profitLossColor = (percentageChange: number) => {
    if (percentageChange === 0) {
        return ''
    }
    return percentageChange > 0 ? 'text-green' : 'text-red'
}

const sortingColor = (sortByPositive?: boolean) => {
    if (sortByPositive === undefined) {
        return 'grey-lighten-1'
    }
    return sortByPositive ? 'black' : 'grey-lighten-1'
}

const formatPercentage = (percentageChange: number) => {
    let prefix = ''
    if (percentageChange > 0) {
        prefix = '+'
    }
    return `${prefix}${percentageChange.toFixed(2)}%`
}
</script>

<template>
    <!-- Settings button -->
    <v-btn
        id="settingsBtn"
        prepend-icon="settings"
        variant="outlined"
        @click.stop="settingsMenuStore.toggle"
        class="mt-4 mx-5 px-4 bg-white"
        >Settings
    </v-btn>

    <!-- Navigation drawer -->
    <v-navigation-drawer
        v-model="settingsMenuStore.isToggled"
        permanent
        location="right"
        width="300"
    >
        <!-- Close drawer button & Search bar -->
        <template v-slot:prepend>
            <v-row no-gutters justify="space-between" align="center">
                <v-col cols="auto">
                    <v-btn
                        icon="close"
                        variant="plain"
                        @click.stop="settingsMenuStore.toggle"
                    ></v-btn>
                </v-col>
                <template v-if="screenerResult.length > 0">
                    <v-col cols="auto">
                        <v-btn
                            prepend-icon="ios_share"
                            variant="text"
                            class="text-blue-darken-3"
                            @click.stop="stockScreenerStore.exportResults()"
                            >Export</v-btn
                        >
                    </v-col>
                </template>
            </v-row>

            <SearchBar />
        </template>

        <!-- Stock screener -->
        <v-container class="py-0">
            <v-row no-gutters justify="space-between" align="center">
                <v-col cols="auto">
                    <p class="font-weight-medium m-0">
                        Stock Screener ({{ screenerResult.length }})
                    </p>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        variant="text"
                        class="text-blue-darken-3"
                        id="edit"
                        @click.stop="stockScreenerStore.toggle"
                        >Edit</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>

        <!-- Stock screener result while idle and result length > 0-->
        <template v-if="screenerResult.length > 0">
            <v-row
                no-gutters
                justify="space-between"
                class="px-4 text-center text-caption text-grey-darken-2"
            >
                <v-col cols="4"
                    ><v-btn density="compact" block plain flat
                        >Symbol</v-btn
                    ></v-col
                >
                <v-col cols="4"
                    ><v-btn
                        density="compact"
                        block
                        plain
                        flat
                        @click.stop="stockScreenerStore.sortByPrice()"
                        >Price<v-row no-gutters
                            ><v-icon
                                size="small"
                                icon="arrow_drop_up"
                                :color="
                                    sortingColor(
                                        stockScreenerStore.sortPriceByPositive ===
                                            undefined
                                            ? false
                                            : !stockScreenerStore.sortPriceByPositive
                                    )
                                "
                                style="position: absolute; top: 1.5px"
                            ></v-icon
                            ><v-icon
                                size="small"
                                icon="
                            arrow_drop_down
                            "
                                :color="
                                    sortingColor(
                                        stockScreenerStore.sortPriceByPositive
                                    )
                                "
                                style="position: absolute; bottom: 1.5px"
                            ></v-icon></v-row></v-btn
                ></v-col>
                <v-col cols="4"
                    ><v-btn
                        density="compact"
                        block
                        plain
                        flat
                        @click.stop="
                            stockScreenerStore.sortByPercentageChange()
                        "
                        >% Chg<v-row no-gutters
                            ><v-icon
                                size="small"
                                icon="arrow_drop_up"
                                :color="
                                    sortingColor(
                                        stockScreenerStore.sortPercentageByPositive ===
                                            undefined
                                            ? false
                                            : !stockScreenerStore.sortPercentageByPositive
                                    )
                                "
                                style="position: absolute; top: 1.5px"
                            ></v-icon
                            ><v-icon
                                size="small"
                                icon="
                                arrow_drop_down
                                "
                                :color="
                                    sortingColor(
                                        stockScreenerStore.sortPercentageByPositive ??
                                            undefined
                                    )
                                "
                                style="position: absolute; bottom: 1.5px"
                            ></v-icon></v-row></v-btn
                ></v-col>
            </v-row>

            <!-- Render stock information -->
            <v-list lines="one">
                <v-list-item
                    v-for="(stockDetails, key) in screenerResult"
                    :key="key"
                    :value="stockDetails.stockCode"
                    class="font-weight-medium"
                    density="comfortable"
                    slim
                    @click.stop="
                        settingsMenuStore.selectStock(stockDetails.stockCode)
                    "
                >
                    <!-- List title -->
                    <v-list-item-title
                        :class="profitLossColor(stockDetails.percentageChange)"
                    >
                        <v-row no-gutters justify="space-between">
                            <v-col cols="5" class="text-black">{{
                                stockDetails.stockName
                            }}</v-col>
                            <v-col cols="3" class="text-center">{{
                                stockDetails.closePrice.toFixed(3)
                            }}</v-col>
                            <v-col cols="4" class="text-end">{{
                                formatPercentage(stockDetails.percentageChange)
                            }}</v-col>
                        </v-row>
                    </v-list-item-title>

                    <!-- List subtitle  -->
                    <v-list-item-subtitle>
                        {{ stockDetails.stockCode }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>

            <!-- Show skeleton loader -->
            <template v-if="stockScreenerStore.status.isBusy()">
                <v-skeleton-loader type="list-item-two-line">
                </v-skeleton-loader>
            </template>

            <!-- Show load more text -->
            <template
                v-else-if="
                    stockScreenerStore.stockScreener.lastStockCode !== '9997'
                "
            >
                <v-row no-gutters>
                    <v-col
                        class="text-center text-grey-darken-2"
                        v-intersect="loadMore"
                    >
                        Load more...
                    </v-col>
                </v-row>
            </template>
        </template>

        <!-- Show skeleton loader while busy -->
        <template
            v-else-if="
                stockScreenerStore.status.isBusy() &&
                screenerResult.length === 0
            "
            v-for="i in 5"
            :key="i"
        >
            <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
        </template>

        <!-- Show no stock found while idle and result length is empty -->

        <template
            v-else-if="
                stockScreenerStore.status.isIdle() && screenerResult.length == 0
            "
        >
            <v-img
                :src="'/assets/svgs/search_not_found.svg'"
                alt="search no found"
                class="mt-3"
                height="154"
            ></v-img>
            <v-row no-gutters class="mb-2">
                <v-col align="center" class="font-weight-medium"
                    >No stock found</v-col
                >
            </v-row>
        </template>

        <!-- Stock screener dialog -->
        <StockScreener />

        <!-- Chart settings button -->
        <template v-slot:append>
            <div class="ma-4">
                <v-btn
                    block
                    bottom
                    prepend-icon="settings"
                    variant="outlined"
                    @click.stop="chartSettingsStore.toggle"
                    class="bg-white"
                    >Chart Settings
                </v-btn>
            </div>
        </template>

        <!-- Chart settings dialog -->
        <ChartSettings />
    </v-navigation-drawer>
</template>

<style>
.v-btn {
    z-index: 10;
    text-transform: unset !important;
}

#settingsBtn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
}
</style>
