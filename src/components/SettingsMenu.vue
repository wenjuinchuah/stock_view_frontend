<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsMenuStore } from '@/stores/SettingsMenuStore'
import { useStockScreenerStore } from '@/stores/StockScreenerStore'
import SearchBar from '@/components/SearchBar.vue'
import StockScreener from '@/components/StockScreener.vue'
import type { StockDetails } from '@/classes/StockDetails'

const settingsMenuStore = useSettingsMenuStore()
const drawerToggled = ref<boolean>(false)

const stockScreenerStore = useStockScreenerStore()
const screenerResult = computed<StockDetails[]>(
    () => stockScreenerStore.screenerResult
)

const toggleSettingsMenu = () => {
    settingsMenuStore.toggle()
    drawerToggled.value = !drawerToggled.value
}

const toggleScreener = () => {
    stockScreenerStore.toggle()
}

const loadMore = (entry: IntersectionObserverEntry) => {
    if (entry && stockScreenerStore.stockScreener.lastStockCode !== '9997') {
        stockScreenerStore.fetch()
    }
}
</script>

<template>
    <v-btn
        id="settingsBtn"
        prepend-icon="settings"
        variant="outlined"
        @click.stop="toggleSettingsMenu"
        class="mt-4 mx-5 px-4 bg-white"
        >Settings
    </v-btn>
    <v-navigation-drawer
        v-model="drawerToggled"
        permanent
        location="right"
        width="280"
    >
        <template v-slot:prepend>
            <v-btn
                icon="close"
                variant="plain"
                @click.stop="toggleSettingsMenu"
            ></v-btn>
            <SearchBar />
        </template>
        <v-container class="py-0">
            <v-row no-gutters justify="space-between">
                <v-col cols="auto" align-self="center">
                    <p class="font-weight-medium m-0">Stock Screener</p>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        variant="text"
                        class="text-blue-darken-3"
                        id="edit"
                        @click.stop="toggleScreener"
                        >Edit</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
        <template v-if="screenerResult.length > 0">
            <!-- Placeholder -->
            <v-row
                no-gutters
                justify="space-between"
                class="px-4 text-center text-caption text-grey-darken-2"
            >
                <v-col cols="6">Symbol</v-col>
                <v-col cols="3">Open</v-col>
                <v-col cols="3">Close</v-col>
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
                    <v-list-item-title>
                        <v-row no-gutters justify="space-between">
                            <v-col cols="6">{{ stockDetails.stockName }}</v-col>
                            <v-col cols="3" class="text-center">{{
                                stockDetails.open.toFixed(3)
                            }}</v-col>
                            <v-col cols="3" class="text-center">{{
                                stockDetails.close.toFixed(3)
                            }}</v-col>
                        </v-row>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ stockDetails.stockCode }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
            <template
                v-if="
                    stockScreenerStore.status.isIdle() &&
                    stockScreenerStore.stockScreener.lastStockCode !== '9997'
                "
            >
                <v-row no-gutters>
                    <v-col class="text-center" v-intersect="loadMore">
                        Load more...
                    </v-col>
                </v-row>
            </template>
            <template v-else-if="stockScreenerStore.status.isBusy()">
                <v-infinite-scroll></v-infinite-scroll>
            </template>
            <template
                v-else-if="
                    stockScreenerStore.stockScreener.lastStockCode === '9997'
                "
            >
                <v-row no-gutters>
                    <v-col class="text-center">No more stock</v-col>
                </v-row>
            </template>
        </template>

        <template
            v-else-if="
                stockScreenerStore.status.isBusy() && screenerResult.length == 0
            "
        >
            <v-infinite-scroll></v-infinite-scroll>
        </template>

        <template v-else-if="screenerResult.length == 0">
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
        <StockScreener />
        <!-- Chart Settings -->
        <template v-slot:append>
            <div class="ma-4">
                <v-btn
                    block
                    bottom
                    prepend-icon="settings"
                    variant="outlined"
                    @click.stop=""
                    class="bg-white"
                    >Chart Settings
                </v-btn>
            </div>
        </template>
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
