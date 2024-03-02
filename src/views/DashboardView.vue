<script setup lang="ts">
import StockChart from "@/components/StockChart.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";
import { computed } from "vue";

const store = useSettingsMenuStore();
const isToggled: bool = computed(() => store.isToggled);
const toggleSettingsMenu = () => {
    store.toggle();
};
</script>

<template>
    <main>
        <div class="d-flex">
            <div class="col">
                <div id="settingsBtn" class="mt-4 mx-5 px-4 position-absolute end-0">
                    <button
                        type="button"
                        class="btn btn-outline-dark btn-sm"
                        data-bs-toggle="collapse"
                        data-bs-target="#settingsMenu"
                        aria-expanded="false"
                        aria-controls="settingsMenu"
                        @click="toggleSettingsMenu"
                        :class="{ invisible: isToggled }"
                    >
                        <i class="bi bi-gear-wide-connected"></i> Settings
                    </button>
                </div>
                <StockChart />
            </div>
            <SettingsMenu />
        </div>
    </main>
</template>

<style>
main {
    height: 100vh;
}

#settingsBtn {
    z-index: 2;
}
</style>
