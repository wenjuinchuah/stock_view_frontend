<script setup lang="ts">
import SettingsMenu from "@/components/SettingsMenu.vue";
import DashboardView from "@/views/DashboardView.vue";
import { useSearchBarStore } from "@/stores/SearchBarStore";
import { onMounted } from "vue";

const store = useSearchBarStore();

onMounted(() => {
    // store.init();
});
</script>

<template>
    <v-layout>
        <SettingsMenu />
        <v-main class="d-flex align-center justify-center" scrollable>
            <DashboardView />
        </v-main>
    </v-layout>
</template>
