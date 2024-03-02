<script setup lang="ts">
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";

const store = useSettingsMenuStore();
const toggleSettingsMenu = () => {
    store.toggle();
};
</script>

<template>
    <div id="settingsMenu" class="collapse collapse-horizontal col-lg-2 col-md-3">
        <button
            class="m-2 btn"
            data-bs-toggle="collapse"
            data-bs-target="#settingsMenu"
            aria-expanded="false"
            aria-controls="settingsMenu"
            @click="toggleSettingsMenu"
        >
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
</template>

<style>
#settingsMenu {
    z-index: 10;
    border: 1px solid #f0f0f0;
}
</style>
