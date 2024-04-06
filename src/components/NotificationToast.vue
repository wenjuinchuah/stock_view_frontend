<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/NotificationStore'

const store = useNotificationStore()
const notifications = computed(() => store.notifications)
</script>

<template>
    <template v-if="notifications.length > 0">
        <div v-for="(notification, key) in notifications" :key="key">
            <v-snackbar
                variant="flat"
                :color="notification.isError ? 'red-lighten-1' : 'white'"
                position="relative"
                v-model="store.toggle"
                multi-line
                rounded="true"
                location="top"
                timeout="5000"
            >
                <v-row no-gutters>
                    <v-col cols="auto"
                        ><v-icon
                            :icon="
                                notification.isError
                                    ? 'warning'
                                    : 'notifications'
                            "
                            size="x-small"
                            start
                        ></v-icon
                    ></v-col>
                    <v-col class="font-weight-bold"
                        >{{
                            notification.isError
                                ? 'Error Message'
                                : 'Notification'
                        }}
                    </v-col></v-row
                >
                <v-row no-gutters justify="space-between">
                    <v-col cols="9">{{ notification.message }}</v-col>
                    <v-col cols="3" class="text-end">{{
                        notification.date
                    }}</v-col>
                </v-row>
            </v-snackbar>
        </div>
    </template>
</template>
