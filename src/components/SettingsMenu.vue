<script setup lang="ts">
import { ref, computed } from "vue";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { useStockChartStore } from "@/stores/StockChartStore";
import SearchBar from "@/components/SearchBar.vue";
import StockDetails from "@/components/StockDetails.vue";

const settingsMenuStore = useSettingsMenuStore();
const drawerToggled: bool = ref(false);

const stockChartStore = useStockChartStore();
const isPriceListEmpty = computed(() => stockChartStore.isPriceListEmpty());

const toggleSettingsMenu = () => {
    settingsMenuStore.toggle();
    drawerToggled.value = !drawerToggled.value;
};
</script>

<template>
    <v-btn
        id="settingsBtn"
        prepend-icon="settings"
        variant="outlined"
        @click.stop="toggleSettingsMenu"
        class="mt-4 mx-5 px-4 position-absolute end-0 bg-white"
        >Settings
    </v-btn>
    <v-navigation-drawer v-model="drawerToggled" temporary location="right">
        <v-btn icon="close" variant="plain" @click.stop="toggleSettingsMenu"></v-btn>
        <SearchBar />
        <v-container>
            <v-row no-gutters justify="space-between">
                <v-col cols="auto" align-self="center">
                    <p class="font-weight-medium m-0">Stock Screener</p>
                </v-col>
                <v-col cols="auto">
                    <v-btn variant="flat" class="text-blue-darken-3" id="edit"
                        >Edit</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
        <v-divider thickness="4" v-if="!isPriceListEmpty" class="m-0"></v-divider>
        <StockDetails />
        <!-- Chart Settings -->
        <v-row no-gutters class="m-3"
            ><v-btn
                block
                id="settingsBtn"
                prepend-icon="settings"
                variant="outlined"
                @click.stop=""
                class="bg-white"
                >Chart Settings
            </v-btn>
        </v-row>
    </v-navigation-drawer>
</template>

<style>
.v-btn {
    z-index: 10;
    text-transform: unset !important;
}
</style>
