<script setup lang="ts">
import SettingsMenu from '@/components/SettingsMenu.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
</script>

<template>
    <v-layout>
        <SettingsMenu />
        <v-main class="d-flex align-center justify-center" scrollable>
            <LoadingOverlay />
            <DashboardView />
        </v-main>
    </v-layout>
</template>
