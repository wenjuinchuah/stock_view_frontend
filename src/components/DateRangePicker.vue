<script setup lang="ts">
import { ref } from "vue";

const startDateToggled = ref(false);
const endDateToggled = ref(false);

const toggleStartDate = () => {
    startDateToggled.value = !startDateToggled.value;
    if (endDateToggled.value === true) {
        endDateToggled.value = false;
    }
};

const toggleEndDate = () => {
    endDateToggled.value = !endDateToggled.value;
    if (startDateToggled.value === true) {
        startDateToggled.value = false;
    }
};

const allowedDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
};
</script>

<template>
    <div class="date-picker-container">
        <v-btn variant="outlined" append-icon="calendar_month" @click="toggleStartDate">Start date</v-btn>
        <v-date-picker v-if="startDateToggled" class="start-date-picker" bg-color="white" color="blue-darken-2"
            hide-header elevation="5" :allowed-dates="allowedDate"/>

        <v-icon icon="arrow_right_alt" class="mx-2"></v-icon>

        <v-btn variant="outlined" append-icon="calendar_month" @click="toggleEndDate">End date</v-btn>
        <v-date-picker v-if="endDateToggled" class="end-date-picker" bg-color="white" color="blue-darken-2" hide-header
            elevation="5" :allowed-dates="allowedDate"/>
    </div>
</template>


<style scoped>
.date-picker-container {
    position: relative;
}

.start-date-picker {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: 100;
}

.end-date-picker {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 100;
}
</style>