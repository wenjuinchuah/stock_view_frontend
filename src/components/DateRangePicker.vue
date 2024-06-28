<script setup lang="ts">
import { ref } from 'vue'

const { startDate: initialStartDate, endDate: initialEndDate } = defineProps([
    'startDate',
    'endDate',
])
const emit = defineEmits(['update:startDate', 'update:endDate'])

const startDateToggled = ref(false)
const endDateToggled = ref(false)
const startDate = ref<Date>(initialStartDate ?? null)
const endDate = ref<Date>(initialEndDate ?? null)

const toggleStartDate = (): void => {
    startDateToggled.value = !startDateToggled.value
    console.log('toggleStartDate: ' + startDateToggled.value)
    if (endDateToggled.value === true) {
        endDateToggled.value = false
    }
}

const toggleEndDate = (): void => {
    endDateToggled.value = !endDateToggled.value
    console.log('toggleEndDate: ' + endDateToggled.value)
    if (startDateToggled.value === true) {
        startDateToggled.value = false
    }
}

function allowedStartDate(date: any): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return date <= today
}

const allowedEndDate = (date: any): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate.value) {
        return date >= startDate.value && date <= today
    } else {
        return date <= today
    }
}

const showDate = (date: Date) => {
    return date
        ? date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : null
}

const updateStartDate = (date: Date) => {
    startDate.value = date
    emit('update:startDate', date)
    setTimeout(() => toggleEndDate(), 50)
}

const updateEndDate = (date: Date) => {
    endDate.value = date
    emit('update:endDate', date)
    setTimeout(() => toggleEndDate(), 50)
}
</script>

<template>
    <div class="date-picker-container">
        <v-btn
            variant="outlined"
            append-icon="calendar_month"
            @click="toggleStartDate"
        >
            {{ showDate(startDate) ?? 'Start date' }}</v-btn
        >
        <v-date-picker
            v-if="startDateToggled"
            class="start-date-picker"
            bg-color="white"
            color="blue-darken-3"
            mode-icon="expand_more"
            hide-header
            elevation="5"
            :allowed-dates="allowedStartDate"
            v-model="startDate"
            @update:modelValue="updateStartDate"
        />

        <v-icon icon="arrow_right_alt" class="mx-2"></v-icon>

        <v-btn
            variant="outlined"
            append-icon="calendar_month"
            @click="toggleEndDate"
            >{{ showDate(endDate) ?? 'End date' }}</v-btn
        >
        <v-date-picker
            v-if="endDateToggled"
            class="end-date-picker"
            bg-color="white"
            color="blue-darken-3"
            mode-icon="expand_more"
            hide-header
            elevation="5"
            :allowed-dates="allowedEndDate"
            v-model="endDate"
            @update:modelValue="updateEndDate"
        />
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
