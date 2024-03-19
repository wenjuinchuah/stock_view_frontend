<script setup lang="ts">
import { computed } from "vue";
import { useSettingsMenuStore } from "@/stores/SettingsMenuStore";

const store = useSettingsMenuStore();
const isToggled: bool = computed(() => store.isToggled);

const toggleSettingsMenu = () => {
    store.toggle();
};
</script>

<template>
    <!-- <v-btn variant="outlined" @click.stop="drawer = !drawer">Settings</v-btn> -->
    <v-btn
        id="settingsBtn"
        prepend-icon="settings"
        variant="outlined"
        @click.stop="toggleSettingsMenu"
        class="mt-4 mx-5 px-4 position-absolute end-0 bg-white"
        >Settings</v-btn
    >
    <v-navigation-drawer v-model="isToggled" temporary location="right">
        <v-btn icon="close" variant="plain" @click.stop="toggleSettingsMenu"></v-btn>
        <v-autocomplete
            class="mx-4 my-1"
            rounded="lg"
            bg-color="colors.white"
            clearable
            density="compact"
            placeholder="Search for any stock"
            variant="outlined"
            append-inner-icon="search"
            menu-icon=""
        ></v-autocomplete>
    </v-navigation-drawer>
</template>

<style>
#settingsBtn {
    z-index: 10;
    text-transform: unset !important;
}
</style>
