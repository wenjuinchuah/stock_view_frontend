<script setup lang="ts">
import { useAddRuleStore } from '@/stores/AddRuleStore'
import { ref, watch, computed, onMounted } from 'vue'

const store = useAddRuleStore()
const availableRules = computed(() => store.availableRules)
const storeSelectedRules = computed(() => store.selectedRules)
const selectedRules = ref<string[]>([])

const confirm = () => {
    store.toggle()
    store.updateRules(selectedRules.value)
}

watch(storeSelectedRules, (newRules) => {
    selectedRules.value = newRules
})

onMounted(() => {
    store.fetch()
    selectedRules.value = storeSelectedRules.value
})
</script>

<template>
    <v-dialog
        max-width="400"
        max-height="300"
        v-model="store.isToggled"
        scrollable
    >
        <v-card class="pa-4">
            <!-- Title -->
            <v-row no-gutters justify="space-between">
                <v-col cols="auto">
                    <v-card-title>Add New Rule</v-card-title>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        icon="close"
                        variant="plain"
                        @click="store.toggle"
                    ></v-btn>
                </v-col>
            </v-row>
            <!-- Rules Selection -->
            <v-row no-gutters class="mx-2">
                <v-col align-self="center">
                    <v-autocomplete
                        class="my-4"
                        rounded="lg"
                        bg-color="colors.white"
                        clearable
                        multiple
                        chips
                        closable-chips
                        density="compact"
                        placeholder="Select rule"
                        variant="outlined"
                        menu-icon=""
                        hide-details="auto"
                        :disabled="availableRules?.size === 0"
                        :items="Array.from(availableRules ?? [])"
                        :item-title="(item) => item[0].toUpperCase()"
                        v-model="selectedRules"
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <!-- Actions button -->
            <v-card-actions>
                <v-btn block class="bg-blue-darken-3" @click.stop="confirm"
                    >Confirm</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
